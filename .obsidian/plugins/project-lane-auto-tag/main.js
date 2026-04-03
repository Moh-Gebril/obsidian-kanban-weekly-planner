const { Notice, Plugin, PluginSettingTab, Setting } = require("obsidian");

const PLUGIN_ID = "project-lane-auto-tag";
const PROJECT_BOARD_TYPES = new Set(["backlog", "backlog-example"]);
const LEGACY_PLACEHOLDER_TAGS = Array.from({ length: 10 }, (_, index) => {
  const letter = String.fromCharCode(97 + index);
  return [`#project/${letter}`, `#project-${letter}`];
}).flat();
const CARD_LINE_PATTERN = /^(\s*[-*+]\s+\[[ xX]\]\s+)(.*)$/;
const TAG_TOKEN_PATTERN = /^#[\p{L}\p{N}\p{M}_/-]+$/u;
const PROJECT_PLACEHOLDER_PATTERN = /^#project(?:\/|-)([a-j])$/u;
const PALETTE = [
  { rgb: [37, 99, 235] },
  { rgb: [2, 132, 199] },
  { rgb: [217, 119, 6] },
  { rgb: [225, 29, 72] },
  { rgb: [124, 58, 237] },
  { rgb: [8, 145, 178] },
  { rgb: [101, 163, 13] },
  { rgb: [234, 88, 12] },
  { rgb: [219, 39, 119] },
  { rgb: [71, 85, 105] },
];
const DEFAULT_SETTINGS = {
  reservedLanes: ["Inbox", "الوارد"],
  registry: {},
};

function cloneSettings(settings) {
  return {
    reservedLanes: Array.isArray(settings.reservedLanes) ? [...settings.reservedLanes] : [...DEFAULT_SETTINGS.reservedLanes],
    registry: settings.registry && typeof settings.registry === "object" ? { ...settings.registry } : {},
  };
}

function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, "").trim();
}

function parseFrontmatterType(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return null;
  }

  const typeMatch = match[1].match(/^\s*type:\s*(.+)\s*$/m);
  if (!typeMatch) {
    return null;
  }

  return stripQuotes(typeMatch[1]);
}

function splitBoardContent(content) {
  const marker = "\n%% kanban:settings";
  const markerIndex = content.indexOf(marker);

  if (markerIndex === -1) {
    return { body: content, settingsBlock: "" };
  }

  return {
    body: content.slice(0, markerIndex),
    settingsBlock: content.slice(markerIndex),
  };
}

function normalizeReservedTitle(value) {
  return value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function tokenizeCardContent(content) {
  const parts = content.trim().split(/\s+/).filter(Boolean);
  const tags = [];
  const other = [];

  for (const part of parts) {
    if (TAG_TOKEN_PATTERN.test(part)) {
      tags.push(part);
    } else {
      other.push(part);
    }
  }

  return { tags, other };
}

function dedupe(values) {
  return Array.from(new Set(values));
}

function inferPlaceholderColorIndex(tag) {
  const match = tag.match(PROJECT_PLACEHOLDER_PATTERN);
  if (!match) {
    return null;
  }

  return match[1].charCodeAt(0) - 97;
}

class ProjectLaneAutoTagSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Project Lane Auto Tag" });
    containerEl.createEl("p", {
      text: "Project lane titles in backlog boards automatically generate project tags and global project styling.",
    });

    new Setting(containerEl)
      .setName("Reserved backlog lanes")
      .setDesc("One lane title per line. Cards in these lanes never receive an auto-generated project tag.")
      .addTextArea((text) => {
        text
          .setPlaceholder("Inbox\nالوارد")
          .setValue(this.plugin.settings.reservedLanes.join("\n"))
          .onChange(async (value) => {
            this.plugin.settings.reservedLanes = value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean);
            await this.plugin.savePluginSettings();
          });

        text.inputEl.rows = 4;
        text.inputEl.cols = 32;
      });
  }
}

module.exports = class ProjectLaneAutoTagPlugin extends Plugin {
  async onload() {
    this.settings = cloneSettings({ ...DEFAULT_SETTINGS, ...(await this.loadData()) });
    this.syncInProgress = new Set();
    this.syncTimers = new Map();
    this.styleEl = null;

    this.addSettingTab(new ProjectLaneAutoTagSettingTab(this.app, this));
    this.registerCommands();
    this.registerVaultEvents();
    this.ensureStyleElement();
    this.renderProjectStyles();

    this.app.workspace.onLayoutReady(async () => {
      await this.syncAllProjectBoards({ silent: true });
    });
  }

  onunload() {
    for (const timer of this.syncTimers.values()) {
      window.clearTimeout(timer);
    }
    this.syncTimers.clear();

    if (this.styleEl) {
      this.styleEl.remove();
      this.styleEl = null;
    }
  }

  registerCommands() {
    this.addCommand({
      id: "sync-current-project-board",
      name: "Sync project tags in current board",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || file.extension !== "md") {
          return false;
        }

        if (checking) {
          return true;
        }

        this.syncProjectBoard(file, { silent: false });
        return true;
      },
    });

    this.addCommand({
      id: "rebuild-project-tag-registry",
      name: "Rebuild project tag registry",
      callback: async () => {
        this.settings.registry = {};
        await this.savePluginSettings();
        await this.syncAllProjectBoards({ silent: false });
        new Notice("Project registry rebuilt.");
      },
    });
  }

  registerVaultEvents() {
    this.registerEvent(this.app.vault.on("modify", (file) => {
      if (file.extension === "md") {
        this.scheduleBoardSync(file);
      }
    }));

    this.registerEvent(this.app.vault.on("rename", (file) => {
      if (file.extension === "md") {
        this.scheduleBoardSync(file);
      }
    }));
  }

  ensureStyleElement() {
    if (this.styleEl) {
      return;
    }

    this.styleEl = document.head.createEl("style", {
      attr: {
        [`data-${PLUGIN_ID}`]: "true",
      },
    });
  }

  async savePluginSettings() {
    await this.saveData({
      reservedLanes: this.settings.reservedLanes,
      registry: this.settings.registry,
    });
    this.renderProjectStyles();
  }

  scheduleBoardSync(file) {
    if (this.syncInProgress.has(file.path)) {
      return;
    }

    const existing = this.syncTimers.get(file.path);
    if (existing) {
      window.clearTimeout(existing);
    }

    const timer = window.setTimeout(() => {
      this.syncTimers.delete(file.path);
      this.syncProjectBoard(file, { silent: true });
    }, 160);

    this.syncTimers.set(file.path, timer);
  }

  async syncAllProjectBoards({ silent }) {
    const files = this.app.vault.getMarkdownFiles().sort((left, right) => left.path.localeCompare(right.path));

    for (const file of files) {
      await this.syncProjectBoard(file, { silent });
    }
  }

  async syncProjectBoard(file, { silent }) {
    if (!file || file.extension !== "md") {
      return false;
    }

    if (this.syncInProgress.has(file.path)) {
      return false;
    }

    const original = await this.app.vault.cachedRead(file);
    if (!this.isProjectBoardContent(original)) {
      return false;
    }

    let result;

    try {
      result = this.buildSyncedBoard(original);
    } catch (error) {
      if (!silent) {
        new Notice(error.message);
      }
      return false;
    }

    const needsWrite = result.content !== original;
    const needsSettingsSave = result.registryChanged;

    if (!needsWrite && !needsSettingsSave) {
      return false;
    }

    this.syncInProgress.add(file.path);

    try {
      if (needsWrite) {
        await this.app.vault.modify(file, result.content);
      }

      if (needsSettingsSave) {
        await this.savePluginSettings();
      } else {
        this.renderProjectStyles();
      }
    } finally {
      this.syncInProgress.delete(file.path);
    }

    return needsWrite || needsSettingsSave;
  }

  isProjectBoardContent(content) {
    return PROJECT_BOARD_TYPES.has(parseFrontmatterType(content));
  }

  isReservedLane(title) {
    const normalized = normalizeReservedTitle(title);
    return this.settings.reservedLanes.some((item) => normalizeReservedTitle(item) === normalized);
  }

  slugifyLaneTitle(title) {
    const lowered = title.normalize("NFKC").toLocaleLowerCase();
    let buffer = "";
    let lastWasDash = false;

    for (const char of lowered) {
      if (/[\p{L}\p{N}\p{M}]/u.test(char)) {
        buffer += char;
        lastWasDash = false;
        continue;
      }

      if (char === " " || char === "_" || char === "-") {
        if (!lastWasDash && buffer.length > 0) {
          buffer += "-";
          lastWasDash = true;
        }
      }
    }

    const slug = buffer.replace(/-+/g, "-").replace(/^-|-$/g, "");
    return slug ? `#${slug}` : null;
  }

  extractProjectLanes(body) {
    const lines = body.split("\n");
    const lanes = [];
    let currentLane = null;

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const laneMatch = line.match(/^##\s+(.+?)\s*$/);

      if (laneMatch) {
        currentLane = {
          title: laneMatch[1],
          lineIndex: index,
          cards: [],
        };
        lanes.push(currentLane);
        continue;
      }

      if (!currentLane) {
        continue;
      }

      const cardMatch = line.match(CARD_LINE_PATTERN);
      if (cardMatch) {
        currentLane.cards.push({
          lineIndex: index,
          prefix: cardMatch[1],
          body: cardMatch[2],
        });
      }
    }

    return { lines, lanes };
  }

  buildSyncedBoard(content) {
    const { body, settingsBlock } = splitBoardContent(content);
    const { lines, lanes } = this.extractProjectLanes(body);
    const seenTags = new Map();
    let registryChanged = false;
    let contentChanged = false;

    for (const lane of lanes) {
      if (this.isReservedLane(lane.title)) {
        continue;
      }

      const derivedTag = this.slugifyLaneTitle(lane.title);
      if (!derivedTag) {
        continue;
      }

      if (seenTags.has(derivedTag)) {
        throw new Error(`Duplicate project lane title detected: "${lane.title}" conflicts with "${seenTags.get(derivedTag)}".`);
      }

      seenTags.set(derivedTag, lane.title);
    }

    const managedTags = new Set([
      ...Object.keys(this.settings.registry),
      ...LEGACY_PLACEHOLDER_TAGS,
      ...seenTags.keys(),
    ]);

    for (const lane of lanes) {
      const targetTag = this.isReservedLane(lane.title) ? null : this.slugifyLaneTitle(lane.title);
      const laneManagedTags = this.collectLaneManagedTags(lane, managedTags);

      if (targetTag) {
        registryChanged = this.ensureRegistryEntry(targetTag, lane.title, laneManagedTags) || registryChanged;
        managedTags.add(targetTag);
      }

      const laneManagedKnown = new Set([...managedTags, ...laneManagedTags]);

      for (const card of lane.cards) {
        const nextBody = this.syncCardBody(card.body, targetTag, laneManagedKnown);
        if (nextBody !== card.body) {
          lines[card.lineIndex] = `${card.prefix}${nextBody}`;
          contentChanged = true;
        }
      }
    }

    const nextBody = lines.join("\n");
    return {
      content: `${nextBody}${settingsBlock}`,
      registryChanged,
      contentChanged,
    };
  }

  collectLaneManagedTags(lane, managedTags) {
    const laneManagedTags = new Set();

    for (const card of lane.cards) {
      const { tags } = tokenizeCardContent(card.body);
      for (const tag of tags) {
        if (managedTags.has(tag) || inferPlaceholderColorIndex(tag) !== null) {
          laneManagedTags.add(tag);
        }
      }
    }

    return laneManagedTags;
  }

  ensureRegistryEntry(tag, title, laneManagedTags) {
    const existing = this.settings.registry[tag];
    if (existing) {
      if (existing.label !== title) {
        existing.label = title;
        return true;
      }

      return false;
    }

    let colorIndex = null;
    const candidates = Array.from(laneManagedTags).filter((item) => item !== tag);

    for (const candidate of candidates) {
      if (this.settings.registry[candidate]) {
        colorIndex = this.settings.registry[candidate].colorIndex;
        break;
      }

      const legacyColorIndex = inferPlaceholderColorIndex(candidate);
      if (legacyColorIndex !== null) {
        colorIndex = legacyColorIndex;
        break;
      }
    }

    if (colorIndex === null) {
      colorIndex = Object.keys(this.settings.registry).length % PALETTE.length;
    }

    this.settings.registry[tag] = {
      colorIndex,
      label: title,
    };

    return true;
  }

  syncCardBody(body, targetTag, managedTags) {
    const { tags, other } = tokenizeCardContent(body);
    const preservedTags = tags.filter((tag) => !managedTags.has(tag) && inferPlaceholderColorIndex(tag) === null);
    const nextTokens = [];

    if (targetTag) {
      nextTokens.push(targetTag);
    }

    nextTokens.push(...dedupe(preservedTags));
    nextTokens.push(...other);

    return nextTokens.join(" ").trim();
  }

  renderProjectStyles() {
    this.ensureStyleElement();

    const rules = [
      "/* Project Lane Auto Tag generated styles */",
    ];

    const pushTagRules = (tag, colorIndex) => {
      const palette = PALETTE[colorIndex % PALETTE.length];
      const [r, g, b] = palette.rgb;
      const rgb = `${r}, ${g}, ${b}`;
      const tagSelector = `.kanban-plugin__item .tag[href="${tag}"]`;
      const cardSelector = `.kanban-plugin__item:has(.tag[href="${tag}"])`;
      const rtlSelector = `.kanban-ar .kanban-plugin__item:has(.tag[href="${tag}"])`;

      rules.push(
        `${tagSelector} {`,
        `  background-color: rgba(${rgb}, 0.16) !important;`,
        `  color: rgba(${rgb}, 1) !important;`,
        `  box-shadow: inset 0 0 0 1px rgba(${rgb}, 0.22);`,
        `}`,
        `${cardSelector} {`,
        `  border-left-color: rgba(${rgb}, 1) !important;`,
        `  background-image: linear-gradient(rgba(${rgb}, 0.08), rgba(${rgb}, 0.08));`,
        `}`,
        `${rtlSelector} {`,
        `  border-left-color: var(--background-modifier-border) !important;`,
        `  border-right-color: rgba(${rgb}, 1) !important;`,
        `}`
      );
    };

    for (const [tag, entry] of Object.entries(this.settings.registry)) {
      pushTagRules(tag, entry.colorIndex);
    }

    for (const legacyTag of LEGACY_PLACEHOLDER_TAGS) {
      const colorIndex = inferPlaceholderColorIndex(legacyTag);
      if (colorIndex !== null) {
        pushTagRules(legacyTag, colorIndex);
      }
    }

    this.styleEl.textContent = rules.join("\n");
  }
};
