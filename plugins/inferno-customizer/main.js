const { Plugin, PluginSettingTab, Setting } = require('obsidian');

// =========================================================================
// SUB-PLUGIN 2: Folder Dashboard (IIFE Wrapped)
// =========================================================================
const FolderDashboardPluginClass = (function() {
  const exports = {};
  const module = { exports };
  
  const { Plugin, ItemView, TFolder, TFile, setIcon, MarkdownView, Menu, Modal, Notice } = require('obsidian');

class RenameModal extends Modal {
  constructor(app, item, onSubmit) {
    super(app);
    this.item = item;
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h3", { text: `Rename ${this.item instanceof TFolder ? 'Folder' : 'Note'}` });

    const currentName = this.item instanceof TFolder ? this.item.name : this.item.basename;
    
    const inputEl = contentEl.createEl("input", {
      type: "text",
      value: currentName,
      cls: "rename-modal-input"
    });
    inputEl.style.width = "100%";
    inputEl.style.padding = "8px 12px";
    inputEl.style.backgroundColor = "var(--background-modifier-form-field)";
    inputEl.style.border = "1px solid var(--background-modifier-border)";
    inputEl.style.borderRadius = "4px";
    inputEl.style.color = "var(--text-normal)";
    inputEl.style.fontSize = "14px";
    inputEl.style.marginBottom = "16px";
    
    inputEl.focus();
    if (!(this.item instanceof TFolder)) {
      inputEl.setSelectionRange(0, currentName.length);
    } else {
      inputEl.select();
    }

    const buttonContainer = contentEl.createEl("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-end";
    buttonContainer.style.gap = "8px";

    const cancelBtn = buttonContainer.createEl("button", { text: "Cancel" });
    cancelBtn.addEventListener("click", () => this.close());

    const submitBtn = buttonContainer.createEl("button", { text: "Rename", cls: "mod-cta" });
    const doRename = () => {
      const newName = inputEl.value.trim();
      const invalidChars = /[\\/:*?"<>|]/;
      if (!newName) {
        new Notice("Name cannot be empty.");
        return;
      }
      if (invalidChars.test(newName)) {
        new Notice("Name contains invalid characters: \\ / : * ? \" < > |");
        return;
      }
      if (newName === currentName) {
        this.close();
        return;
      }
      this.onSubmit(newName);
      this.close();
    };
    submitBtn.addEventListener("click", doRename);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doRename();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.close();
      }
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class DeleteConfirmModal extends Modal {
  constructor(app, item, onDelete) {
    super(app);
    this.item = item;
    this.onDelete = onDelete;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    const isFolder = this.item instanceof TFolder;
    const typeStr = isFolder ? "folder" : "note";
    const nameStr = isFolder ? this.item.name : this.item.basename;

    contentEl.createEl("h3", { text: `Delete ${isFolder ? 'Folder' : 'Note'}` });
    contentEl.createEl("p", { 
      text: `Are you sure you want to delete the ${typeStr} "${nameStr}"? This will move it to the system trash.` 
    });

    const buttonContainer = contentEl.createEl("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-end";
    buttonContainer.style.gap = "8px";

    const cancelBtn = buttonContainer.createEl("button", { text: "Cancel" });
    cancelBtn.addEventListener("click", () => this.close());

    const deleteBtn = buttonContainer.createEl("button", { text: "Delete", cls: "mod-warning" });
    deleteBtn.addEventListener("click", () => {
      this.onDelete();
      this.close();
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}

class CreateItemModal extends Modal {
  constructor(app, type, currentPath, onSubmit) {
    super(app);
    this.type = type;
    this.currentPath = currentPath;
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    
    const titleText = this.type === "note" ? "Create New Note" : "Create New Folder";
    contentEl.createEl("h3", { text: titleText });

    const inputEl = contentEl.createEl("input", {
      type: "text",
      placeholder: this.type === "note" ? "Note name..." : "Folder name...",
      cls: "create-modal-input"
    });
    inputEl.style.width = "100%";
    inputEl.style.padding = "8px 12px";
    inputEl.style.backgroundColor = "var(--background-modifier-form-field)";
    inputEl.style.border = "1px solid var(--background-modifier-border)";
    inputEl.style.borderRadius = "4px";
    inputEl.style.color = "var(--text-normal)";
    inputEl.style.fontSize = "14px";
    inputEl.style.marginBottom = "16px";
    inputEl.focus();

    const buttonContainer = contentEl.createEl("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "flex-end";
    buttonContainer.style.gap = "8px";

    const cancelBtn = buttonContainer.createEl("button", { text: "Cancel" });
    cancelBtn.addEventListener("click", () => this.close());

    const submitBtn = buttonContainer.createEl("button", { 
      text: this.type === "note" ? "Create Note" : "Create Folder", 
      cls: "mod-cta" 
    });

    const doCreate = () => {
      const name = inputEl.value.trim();
      const invalidChars = /[\\/:*?"<>|]/;
      if (!name) {
        new Notice("Name cannot be empty.");
        return;
      }
      if (invalidChars.test(name)) {
        new Notice("Name contains invalid characters: \\ / : * ? \" < > |");
        return;
      }
      this.onSubmit(name);
      this.close();
    };

    submitBtn.addEventListener("click", doCreate);
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doCreate();
      } else if (e.key === "Escape") {
        e.preventDefault();
        this.close();
      }
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}


const VIEW_TYPE = "folder-dashboard-view";

function createBreadcrumbsDOM(containerEl, path, isFile, onNavigate, onMiddleClick) {
  containerEl.empty();
  containerEl.classList.add("inferno-breadcrumb-container");

  // Always start with Vault
  const vaultItem = containerEl.createEl("span", {
    text: "Vault",
    cls: "inferno-breadcrumb-item"
  });

  const isRoot = !path;
  if (isRoot && !isFile) {
    vaultItem.classList.add("is-active");
  } else {
    vaultItem.addEventListener("click", (e) => {
      e.stopPropagation();
      onNavigate("");
    });
  }

  // Handle middle-click on Vault item
  vaultItem.addEventListener("mousedown", (e) => {
    if (e.button === 1) {
      e.preventDefault();
    }
  });
  vaultItem.addEventListener("auxclick", (e) => {
    if (e.button === 1) {
      e.stopPropagation();
      e.preventDefault();
      if (onMiddleClick) onMiddleClick("", e);
    }
  });

  if (path) {
    const parts = path.split("/");
    let currentAccumulated = "";

    parts.forEach((part, index) => {
      // Add separator before this part
      containerEl.createEl("span", { cls: "inferno-breadcrumb-separator" });

      currentAccumulated = currentAccumulated ? `${currentAccumulated}/${part}` : part;
      const targetPath = currentAccumulated;
      const isLast = (index === parts.length - 1);

      const partItem = containerEl.createEl("span", {
        text: part.endsWith(".md") ? part.slice(0, -3) : part,
        cls: "inferno-breadcrumb-item"
      });

      if (isLast) {
        partItem.classList.add("is-active");
      } else {
        partItem.addEventListener("click", (e) => {
          e.stopPropagation();
          onNavigate(targetPath);
        });
      }

      // Handle middle-click on part items
      partItem.addEventListener("mousedown", (e) => {
        if (e.button === 1) {
          e.preventDefault();
        }
      });
      partItem.addEventListener("auxclick", (e) => {
        if (e.button === 1) {
          e.stopPropagation();
          e.preventDefault();
          
          let dirPath = targetPath;
          if (isFile && isLast) {
            const segments = targetPath.split("/");
            segments.pop();
            dirPath = segments.join("/");
          }
          if (onMiddleClick) onMiddleClick(dirPath, e);
        }
      });
    });
  }
}

class FolderDashboardView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.currentPath = "";
    this.searchQuery = "";
    this.isGlobalSearch = false;
    this.selectedIndex = -1;
    this.filteredItems = [];

    // Zoom and pan states for Board view
    this.zoom = 1;
    this.targetZoom = 1;
    this.panOffset = { x: 0, y: 0 };
    this.targetPanOffset = { x: 0, y: 0 };
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.draggedItem = null;
    this.draggedElement = null;
    this.dragStartMouse = { x: 0, y: 0 };
    this.dragStartPos = { x: 0, y: 0 };
    this.hasMoved = false;
    this.isCameraTracking = true;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    if (!this.currentPath || this.currentPath === "/" || this.currentPath === "") {
      return "Vault";
    }
    const parts = this.currentPath.split("/");
    return parts[parts.length - 1];
  }
  getIcon() {
    return "folder";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("obsidian-folder-dashboard-container");
    container.tabIndex = 0;

    this.headerEl = container.createEl("div", { cls: "dashboard-header" });

    this.sectionsContainerEl = container.createEl("div", { cls: "dashboard-content-scroll" });
    this.sectionsContainerEl.addEventListener("pointerdown", (e) => this.handleViewportPointerDown(e));
    this.sectionsContainerEl.addEventListener("pointermove", (e) => this.handleViewportPointerMove(e));
    this.sectionsContainerEl.addEventListener("pointerup", (e) => this.handleViewportPointerUp(e));
    this.sectionsContainerEl.addEventListener("wheel", (e) => this.handleViewportWheel(e), { passive: false });
    this.sectionsContainerEl.addEventListener("scroll", () => {
      if (this.getViewMode() === "board") {
        this.sectionsContainerEl.scrollLeft = 0;
        this.sectionsContainerEl.scrollTop = 0;
      }
    });

    const searchWrapper = container.createEl("div", { cls: "dashboard-search-wrapper" });
    this.searchInput = searchWrapper.createEl("input", {
      type: "text",
      placeholder: "Type folder or note name...",
      cls: "dashboard-search-input"
    });

    this.searchInput.addEventListener("input", () => this.handleSearch());
    this.searchInput.addEventListener("keydown", (e) => this.handleKeyDown(e));

    container.addEventListener("click", () => {
      this.searchInput.focus();
    });

    this.searchInput.addEventListener("blur", () => {
      setTimeout(() => {
        if (document.activeElement === document.body || container.contains(document.activeElement)) {
          this.searchInput.focus();
        }
      }, 50);
    });

    this.leaf.updateHeader();
    this.render();
    setTimeout(() => {
      this.searchInput.focus();
    }, 100);
  }
  async onClose() {}
  getViewMode() {
    const modes = this.plugin.settings.folderViewModes || {};
    return modes[this.currentPath] || "dashboard";
  }
  async setViewMode(mode) {
    if (!this.plugin.settings.folderViewModes) {
      this.plugin.settings.folderViewModes = {};
    }
    this.plugin.settings.folderViewModes[this.currentPath] = mode;
    await this.plugin.saveSettings();
    this.zoom = 1;
    this.targetZoom = 1;
    this.panOffset = { x: 0, y: 0 };
    this.targetPanOffset = { x: 0, y: 0 };
    this.hasMoved = false; // Reset drag state on mode change
    this.render();
  }
  getItemPosition(itemPath, index) {
    const positions = this.plugin.settings.boardPositions || {};
    const folderPositions = positions[this.currentPath] || {};
    if (folderPositions[itemPath]) {
      return folderPositions[itemPath];
    }
    // Default grid position if not stored
    const cols = 2;
    const col = index % cols;
    const row = Math.floor(index / cols);
    return { x: 100 + col * 320, y: 150 + row * 180 };
  }
  async saveItemPosition(itemPath, x, y) {
    if (!this.plugin.settings.boardPositions) {
      this.plugin.settings.boardPositions = {};
    }
    if (!this.plugin.settings.boardPositions[this.currentPath]) {
      this.plugin.settings.boardPositions[this.currentPath] = {};
    }
    this.plugin.settings.boardPositions[this.currentPath][itemPath] = { x, y };
    await this.plugin.saveSettings();
  }
  renderViewSwitcherHUD(container) {
    const existingHud = container.querySelector(".dashboard-hud-controls");
    if (existingHud) {
      existingHud.remove();
    }
    const hudEl = container.createEl("div", { cls: "dashboard-hud-controls" });
    const currentMode = this.getViewMode();
    const modes = ["dashboard", "list", "board"];
    modes.forEach(mode => {
      const btn = hudEl.createEl("button", {
        cls: `switcher-btn ${currentMode === mode ? "is-active" : ""}`,
        text: mode.charAt(0).toUpperCase() + mode.slice(1)
      });
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.setViewMode(mode);
      });
    });
  }
  adjustZoom(delta) {
    let newZoom = this.zoom + delta;
    newZoom = Math.min(Math.max(0.25, newZoom), 2.5);
    this.zoom = newZoom;
    this.updateZoomAndPanStyles();
  }
  resetZoomAndPan() {
    this.zoom = 1;
    this.targetZoom = 1;
    this.panOffset = { x: 0, y: 0 };
    this.targetPanOffset = { x: 0, y: 0 };
    this.updateZoomAndPanStyles();
  }
  updateZoomAndPanStyles() {
    const canvasEl = this.containerEl.querySelector(".dashboard-board-canvas");
    if (canvasEl) {
      canvasEl.style.transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoom})`;
    }
    const viewportEl = this.containerEl.querySelector(".dashboard-board-viewport");
    if (viewportEl) {
      viewportEl.style.setProperty("--grid-size", `${24 * this.zoom}px`);
      viewportEl.style.setProperty("--pan-x", `${this.panOffset.x}px`);
      viewportEl.style.setProperty("--pan-y", `${this.panOffset.y}px`);
    }
    const zoomLevelEl = this.containerEl.querySelector(".zoom-level");
    if (zoomLevelEl) {
      zoomLevelEl.textContent = `${Math.round(this.zoom * 100)}%`;
    }
  }
  handleViewportPointerDown(e) {
    if (this.getViewMode() !== "board") return;
    if (e.target !== this.sectionsContainerEl && !e.target.classList.contains("dashboard-board-canvas")) return;
    this.isPanning = true;
    this.isCameraTracking = false;
    this.sectionsContainerEl.setPointerCapture(e.pointerId);
    this.panStart = {
      x: e.clientX - this.panOffset.x,
      y: e.clientY - this.panOffset.y
    };
    this.targetPanOffset = { ...this.panOffset };
  }
  handleViewportPointerMove(e) {
    if (this.getViewMode() !== "board") return;
    if (!this.isPanning) return;
    const dx = e.clientX - this.panStart.x;
    const dy = e.clientY - this.panStart.y;
    this.panOffset = { x: dx, y: dy };
    this.targetPanOffset = { x: dx, y: dy };
    this.updateZoomAndPanStyles();
  }
  handleViewportPointerUp(e) {
    if (this.getViewMode() !== "board") return;
    if (!this.isPanning) return;
    this.isPanning = false;
    this.sectionsContainerEl.releasePointerCapture(e.pointerId);
    this.targetPanOffset = { ...this.panOffset };
  }
  handleViewportWheel(e) {
    if (this.getViewMode() !== "board") return;
    e.preventDefault();
    e.stopPropagation();
    this.isCameraTracking = false;

    if (this.targetZoom === undefined) this.targetZoom = this.zoom;
    if (this.targetPanOffset === undefined) this.targetPanOffset = { ...this.panOffset };

    if (e.ctrlKey) {
      const rect = this.sectionsContainerEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const boardX = (mouseX - this.targetPanOffset.x) / this.targetZoom;
      const boardY = (mouseY - this.targetPanOffset.y) / this.targetZoom;
      
      let dy = e.deltaY;
      if (e.deltaMode === 1) {
        dy *= 40;
      } else if (e.deltaMode === 2) {
        dy *= 800;
      }
      
      const zoomIntensity = 0.0012;
      let newZoom = this.targetZoom * Math.exp(-dy * zoomIntensity);
      newZoom = Math.min(Math.max(0.25, newZoom), 2.5);
      
      const newPanX = mouseX - boardX * newZoom;
      const newPanY = mouseY - boardY * newZoom;
      
      this.targetZoom = newZoom;
      this.targetPanOffset = { x: newPanX, y: newPanY };
    } else {
      let dx = e.deltaX;
      let dy = e.deltaY;
      
      if (e.deltaMode === 1) {
        dx *= 40;
        dy *= 40;
      } else if (e.deltaMode === 2) {
        dx *= 800;
        dy *= 800;
      }
      
      this.targetPanOffset.x -= dx;
      this.targetPanOffset.y -= dy;
    }

    this.startSmoothTransition();
  }
  startSmoothTransition() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    const animate = () => {
      if (this.getViewMode() !== "board") {
        this.isTransitioning = false;
        return;
      }

      const zoomDiff = this.targetZoom - this.zoom;
      const panDiffX = this.targetPanOffset.x - this.panOffset.x;
      const panDiffY = this.targetPanOffset.y - this.panOffset.y;

      const threshold = 0.002;
      const panThreshold = 0.2;

      const lerpFactor = 0.18; // organic smooth scroll damping factor

      let needsMore = false;

      if (Math.abs(zoomDiff) > threshold) {
        this.zoom += zoomDiff * lerpFactor;
        needsMore = true;
      } else {
        this.zoom = this.targetZoom;
      }

      if (Math.abs(panDiffX) > panThreshold || Math.abs(panDiffY) > panThreshold) {
        this.panOffset.x += panDiffX * lerpFactor;
        this.panOffset.y += panDiffY * lerpFactor;
        needsMore = true;
      } else {
        this.panOffset.x = this.targetPanOffset.x;
        this.panOffset.y = this.targetPanOffset.y;
      }

      this.updateZoomAndPanStyles();

      if (needsMore) {
        requestAnimationFrame(animate);
      } else {
        this.isTransitioning = false;
      }
    };

    requestAnimationFrame(animate);
  }
  getCurrentFolder() {
    if (this.currentPath === "") {
      return this.app.vault.getRoot();
    }
    const file = this.app.vault.getAbstractFileByPath(this.currentPath);
    if (file instanceof TFolder) {
      return file;
    }
    return this.app.vault.getRoot();
  }
  handleSearch() {
    this.searchQuery = this.searchInput.value.trim().toLowerCase();
    this.selectedIndex = this.searchQuery ? 0 : -1;
    this.isCameraTracking = true;
    this.renderItems();
  }
  render() {
    this.updateNativeBreadcrumbs();
    this.renderBreadcrumbs();
    this.renderViewSwitcherHUD(this.headerEl);
    this.renderItems();
  }
  renderBreadcrumbs() {
    if (!this.headerEl) return;
    let breadcrumbsWrapper = this.headerEl.querySelector(".inferno-breadcrumb-container");
    if (!breadcrumbsWrapper) {
      breadcrumbsWrapper = document.createElement("div");
      breadcrumbsWrapper.className = "inferno-breadcrumb-container";
      this.headerEl.insertBefore(breadcrumbsWrapper, this.headerEl.firstChild);
    }
    createBreadcrumbsDOM(
      breadcrumbsWrapper, 
      this.currentPath, 
      false, 
      (targetPath) => this.navigateToPath(targetPath),
      (targetPath, e) => {
        if (e.shiftKey) {
          this.plugin.revealInLeftExplorer(targetPath);
        } else if (e.ctrlKey || e.metaKey) {
          this.plugin.activateViewAndNavigateRight(targetPath);
        } else {
          this.plugin.activateViewAndNavigateNewTab(targetPath);
        }
      }
    );
  }
  updateNativeBreadcrumbs() {
    const headerEl = this.containerEl.querySelector(".view-header") || 
                     this.containerEl.parentElement?.querySelector(".view-header") ||
                     this.containerEl.closest(".workspace-leaf")?.querySelector(".view-header");
    if (!headerEl) return;
    
    let titleParent = headerEl.querySelector(".view-header-title-parent");
    if (!titleParent) {
      const titleContainer = headerEl.querySelector(".view-header-title-container") ||
                             headerEl.querySelector(".view-header-left");
      if (titleContainer) {
        titleParent = document.createElement("div");
        titleParent.className = "view-header-title-parent";
        const titleEl = headerEl.querySelector(".view-header-title");
        if (titleEl) {
          titleContainer.insertBefore(titleParent, titleEl);
        } else {
          titleContainer.appendChild(titleParent);
        }
      }
    }
    
    if (titleParent) {
      titleParent.empty();
      
      if (this.currentPath !== "") {
        const vaultSpan = titleParent.createEl("span", {
          text: "Vault",
          cls: "view-header-breadcrumb"
        });
        vaultSpan.addEventListener("click", (e) => {
          e.stopPropagation();
          this.navigateToPath("");
        });
        vaultSpan.addEventListener("mousedown", (e) => {
          if (e.button === 1) {
            e.preventDefault();
          }
        });
        vaultSpan.addEventListener("auxclick", (e) => {
          if (e.button === 1) {
            e.stopPropagation();
            e.preventDefault();
            if (e.shiftKey) {
              this.plugin.revealInLeftExplorer("");
            } else if (e.ctrlKey || e.metaKey) {
              this.plugin.activateViewAndNavigateRight("");
            } else {
              this.plugin.activateViewAndNavigateNewTab("");
            }
          }
        });
        
        const parts = this.currentPath.split("/");
        parts.pop();
        
        let currentAccumulated = "";
        parts.forEach((part) => {
          titleParent.createEl("span", { cls: "view-header-breadcrumb-separator" });
          
          currentAccumulated = currentAccumulated ? `${currentAccumulated}/${part}` : part;
          const targetPath = currentAccumulated;
          
          const partSpan = titleParent.createEl("span", {
            text: part,
            cls: "view-header-breadcrumb"
          });
          partSpan.addEventListener("click", (e) => {
            e.stopPropagation();
            this.navigateToPath(targetPath);
          });
          partSpan.addEventListener("mousedown", (e) => {
            if (e.button === 1) {
              e.preventDefault();
            }
          });
          partSpan.addEventListener("auxclick", (e) => {
            if (e.button === 1) {
              e.stopPropagation();
              e.preventDefault();
              if (e.shiftKey) {
                this.plugin.revealInLeftExplorer(targetPath);
              } else if (e.ctrlKey || e.metaKey) {
                this.plugin.activateViewAndNavigateRight(targetPath);
              } else {
                this.plugin.activateViewAndNavigateNewTab(targetPath);
              }
            }
          });
        });
        
        titleParent.createEl("span", { cls: "view-header-breadcrumb-separator" });
      }
    }
  }
  createCard(parentEl, item, index, totalItems, isAbsolute = false) {
    const isSelected = this.selectedIndex === index;
    const isFolder = item instanceof TFolder;
    const typeStr = isFolder ? "folder" : "file";
    
    const card = parentEl.createEl("div", {
      cls: `dashboard-card ${typeStr}-card ${isSelected ? "is-selected" : ""}`
    });
    
    if (isAbsolute) {
      const pos = this.getItemPosition(item.path, index);
      card.style.left = `${pos.x}px`;
      card.style.top = `${pos.y}px`;
    }

    // Glare overlay for premium spotlight
    card.createEl("div", { cls: "card-glare-overlay" });

    // Title Row with Icon
    const titleRow = card.createEl("div", { cls: "card-title-row" });
    const iconSpan = titleRow.createEl("span", { cls: "card-title-icon" });
    setIcon(iconSpan, isFolder ? "folder" : "file-text");
    titleRow.createEl("span", { text: isFolder ? item.name : item.basename, cls: "card-title-text" });

    // Bottom row: subtitle
    const bottomRow = card.createEl("div", { cls: "card-bottom-row" });
    if (isFolder) {
      const count = item.children.length;
      bottomRow.createEl("span", {
        text: `${count} item${count === 1 ? "" : "s"}`,
        cls: "card-subtitle"
      });
    } else {
      const d = new Date(item.stat.mtime);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      bottomRow.createEl("span", {
        text: dateStr,
        cls: "card-subtitle"
      });
    }

    // Mouse tracking for spotlight glow
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });

    // Handle clicks
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isAbsolute && this.hasMoved) {
        this.hasMoved = false; // Reset once blocked
        return; // Don't trigger navigation if it was dragged
      }
      if (isFolder) {
        this.navigateToPath(item.path);
      } else {
        this.openFile(item);
      }
    });

    // Context menu for rename/delete
    card.addEventListener("contextmenu", (e) => {
      this.showItemContextMenu(e, item);
    });

    return card;
  }
  renderItems() {
    if (this.animationEngine) {
      this.animationEngine.destroy();
      this.animationEngine = null;
    }
    this.sectionsContainerEl.empty();
    
    let filteredFolders = [];
    let filteredFiles = [];

    if (this.isGlobalSearch && this.searchQuery) {
      const allFiles = this.app.vault.getAllLoadedFiles();
      allFiles.forEach((child) => {
        if (child.name.toLowerCase().includes(this.searchQuery)) {
          if (child instanceof TFolder) {
            if (child.path !== "/" && child.path !== "") {
              filteredFolders.push(child);
            }
          } else if (child instanceof TFile && child.extension === "md") {
            filteredFiles.push(child);
          }
        }
      });
      filteredFolders.sort((a, b) => a.name.localeCompare(b.name));
      filteredFiles.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      const currentFolder = this.getCurrentFolder();
      const children = currentFolder.children;
      const subfolders = [];
      const files = [];
      children.forEach((child) => {
        if (child instanceof TFolder) {
          subfolders.push(child);
        } else if (child instanceof TFile && child.extension === "md") {
          files.push(child);
        }
      });
      subfolders.sort((a, b) => a.name.localeCompare(b.name));
      files.sort((a, b) => a.name.localeCompare(b.name));

      filteredFolders = subfolders.filter((f) => f.name.toLowerCase().includes(this.searchQuery));
      filteredFiles = files.filter((f) => f.basename.toLowerCase().includes(this.searchQuery));
    }

    this.filteredItems = [...filteredFolders, ...filteredFiles];

    if (this.filteredItems.length === 0) {
      this.selectedIndex = -1;
    } else if (this.selectedIndex >= this.filteredItems.length) {
      this.selectedIndex = this.filteredItems.length - 1;
    }

    const viewMode = this.getViewMode();
    
    // Reset view class
    this.sectionsContainerEl.className = "dashboard-content-scroll";
    this.sectionsContainerEl.style.overflowY = "auto";

    if (viewMode === "board") {
      this.sectionsContainerEl.className = "dashboard-board-viewport";
      this.sectionsContainerEl.style.overflowY = "hidden";
      
      const canvasEl = this.sectionsContainerEl.createEl("div", { cls: "dashboard-board-canvas" });
      this.updateZoomAndPanStyles();

      if (this.filteredItems.length === 0) {
        this.sectionsContainerEl.createEl("div", {
          text: "No folders or notes found. Double-click or create items to get started.",
          cls: "no-items-message"
        });
      } else {
        this.filteredItems.forEach((item, index) => {
          const card = this.createCard(canvasEl, item, index, this.filteredItems.length, true);
          
          // Setup dragging for this card
          card.addEventListener("pointerdown", (e) => {
            if (e.target.closest("button") || e.target.closest("input") || e.target.closest("span.breadcrumb-item")) return;
            e.preventDefault();
            e.stopPropagation();
            
            this.draggedItem = item;
            this.draggedElement = card;
            this.hasMoved = false;
            this.isCameraTracking = false;
            
            card.setPointerCapture(e.pointerId);
            card.classList.add("is-dragging");
            card.style.zIndex = "1000";
            card.setAttribute("data-dragging", "true");
            
            const pos = this.getItemPosition(item.path, index);
            this.dragStartPos = { x: pos.x, y: pos.y };
            this.dragStartMouse = { x: e.clientX, y: e.clientY };
          });
          
          card.addEventListener("pointermove", (e) => {
            if (this.draggedItem !== item || !this.draggedElement) return;
            e.preventDefault();
            
            const dx = e.clientX - this.dragStartMouse.x;
            const dy = e.clientY - this.dragStartMouse.y;
            
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
              this.hasMoved = true;
            }
            
            if (this.hasMoved) {
              // Divide delta by zoom scale to keep movement accurate
              const newX = this.dragStartPos.x + dx / this.zoom;
              const newY = this.dragStartPos.y + dy / this.zoom;
              
              this.draggedElement.style.left = `${newX}px`;
              this.draggedElement.style.top = `${newY}px`;
            }
          });
          
          card.addEventListener("pointerup", async (e) => {
            if (this.draggedItem !== item || !this.draggedElement) return;
            e.preventDefault();
            
            card.releasePointerCapture(e.pointerId);
            card.classList.remove("is-dragging");
            card.style.zIndex = "";
            card.removeAttribute("data-dragging");
            
            if (this.hasMoved) {
              const finalX = parseInt(this.draggedElement.style.left, 10);
              const finalY = parseInt(this.draggedElement.style.top, 10);
              await this.saveItemPosition(item.path, finalX, finalY);
              
              // Reset hasMoved after the click event has had a chance to process
              setTimeout(() => {
                this.hasMoved = false;
              }, 50);
            } else {
              this.hasMoved = false;
            }
            
            this.draggedItem = null;
            this.draggedElement = null;
          });
        });
      }

      // Initialize card animation engine
      const boardCards = canvasEl.querySelectorAll('.dashboard-card');
      if (boardCards.length > 0) {
        const itemsData = this.filteredItems.map((item, idx) => ({
          element: boardCards[idx],
          name: item instanceof TFolder ? item.name : item.basename,
          itemCount: item instanceof TFolder ? item.children.length : 1,
          index: idx,
          path: item.path
        }));
        this.animationEngine = new CardAnimationEngine(this, canvasEl, itemsData, () => this.zoom);
      }

    } else if (viewMode === "list") {
      const listContainer = this.sectionsContainerEl.createEl("div", { cls: "dashboard-list-container" });
      if (this.filteredItems.length === 0) {
        listContainer.createEl("div", {
          text: "No subfolders or notes found.",
          cls: "no-items-message"
        });
      } else {
        const table = listContainer.createEl("table", { cls: "dashboard-list-table" });
        const thead = table.createEl("thead");
        const headerRow = thead.createEl("tr");
        headerRow.createEl("th", { text: "Name" });
        headerRow.createEl("th", { text: "Type" });
        headerRow.createEl("th", { text: "Info" });
        
        const tbody = table.createEl("tbody");
        this.filteredItems.forEach((item, index) => {
          const isSelected = this.selectedIndex === index;
          const isFolder = item instanceof TFolder;
          const typeStr = isFolder ? "folder" : "file";
          
          const row = tbody.createEl("tr", {
            cls: `dashboard-list-row ${typeStr}-row ${isSelected ? "is-selected" : ""}`
          });
          
          row.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isFolder) {
              this.navigateToPath(item.path);
            } else {
              this.openFile(item);
            }
          });
          
          row.addEventListener("contextmenu", (e) => {
            this.showItemContextMenu(e, item);
          });
          
          const nameCell = row.createEl("td");
          const flexContainer = nameCell.createEl("div", { cls: "list-item-name-cell" });
          const iconSpan = flexContainer.createEl("span", { cls: "list-item-icon" });
          setIcon(iconSpan, isFolder ? "folder" : "file-text");
          flexContainer.createEl("span", { text: isFolder ? item.name : item.basename });
          
          const typeCell = row.createEl("td", { cls: "list-item-type-cell" });
          typeCell.createEl("span", { text: isFolder ? "FOLDER" : "NOTE" });
          
          const infoCell = row.createEl("td", { cls: "list-item-info-cell" });
          if (isFolder) {
            const count = item.children.length;
            infoCell.createEl("span", { text: `${count} item${count === 1 ? "" : "s"}` });
          } else {
            const d = new Date(item.stat.mtime);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
            infoCell.createEl("span", { text: dateStr });
          }
        });
      }
    } else {
      // dashboard mode (traditional)
      const foldersSection = this.sectionsContainerEl.createEl("div", { cls: "dashboard-section" });
      foldersSection.createEl("h3", { text: "Folders", cls: "section-title" });
      const foldersGridEl = foldersSection.createEl("div", { cls: "dashboard-folders-grid" });
      
      if (filteredFolders.length === 0) {
        foldersGridEl.createEl("div", {
          text: "No subfolders found.",
          cls: "no-items-message"
        });
      } else {
        filteredFolders.forEach((folder, idx) => {
          this.createCard(foldersGridEl, folder, idx, this.filteredItems.length, false);
        });
      }
      
      const filesSection = this.sectionsContainerEl.createEl("div", { cls: "dashboard-section" });
      filesSection.createEl("h3", { text: "Notes", cls: "section-title" });
      const filesGridEl = filesSection.createEl("div", { cls: "dashboard-files-grid" });
      
      if (filteredFiles.length === 0) {
        filesGridEl.createEl("div", {
          text: "No markdown notes found.",
          cls: "no-items-message"
        });
      } else {
        filteredFiles.forEach((file, idx) => {
          const itemIndex = filteredFolders.length + idx;
          this.createCard(filesGridEl, file, itemIndex, this.filteredItems.length, false);
        });
      }
    }

    this.scrollToSelected();
  }
  scrollToSelected() {
    if (this.getViewMode() === "board") return;
    const selectedEl = this.containerEl.querySelector(".dashboard-card.is-selected");
    if (selectedEl && this.sectionsContainerEl) {
      const containerRect = this.sectionsContainerEl.getBoundingClientRect();
      const elRect = selectedEl.getBoundingClientRect();
      const isAbove = elRect.top < containerRect.top;
      const isBelow = elRect.bottom > containerRect.bottom;
      if (isAbove) {
        this.sectionsContainerEl.scrollTop -= (containerRect.top - elRect.top + 10);
      } else if (isBelow) {
        this.sectionsContainerEl.scrollTop += (elRect.bottom - containerRect.bottom + 10);
      }
    }
  }
  navigateToPath(path) {
    this.currentPath = path;
    this.searchQuery = "";
    this.isGlobalSearch = false;
    if (this.searchInput) {
      this.searchInput.value = "";
      this.searchInput.placeholder = "Type folder or note name...";
    }
    this.selectedIndex = -1;
    this.hasMoved = false; // Reset drag state on navigation
    this.leaf.updateHeader();
    this.render();
    if (this.searchInput) {
      this.searchInput.focus();
    }
  }

  startGlobalSearch() {
    this.isGlobalSearch = true;
    this.searchQuery = "";
    if (this.searchInput) {
      this.searchInput.value = "";
      this.searchInput.placeholder = "Search all folders & files...";
      this.searchInput.focus();
    }
    this.render();
  }
  openFile(file) {
    this.leaf.openFile(file);
  }
  showItemContextMenu(e, item) {
    e.preventDefault();
    e.stopPropagation();
    const menu = new Menu();
    menu.addItem((menuItem) => {
      menuItem
        .setTitle("Rename")
        .setIcon("pencil")
        .onClick(() => {
          new RenameModal(this.app, item, async (newName) => {
            const parentPath = item.parent ? item.parent.path : "";
            let newPath = "";
            if (item instanceof TFolder) {
              newPath = parentPath === "/" || parentPath === "" ? newName : `${parentPath}/${newName}`;
            } else {
              newPath = parentPath === "/" || parentPath === "" ? `${newName}.md` : `${parentPath}/${newName}.md`;
            }
            try {
              await this.app.fileManager.renameFile(item, newPath);
              new Notice(`Renamed to ${newName}`);
              this.render();
            } catch (err) {
              new Notice(`Error renaming: ${err.message}`);
            }
          }).open();
        });
    });
    menu.addItem((menuItem) => {
      menuItem
        .setTitle("Delete")
        .setIcon("trash")
        .onClick(() => {
          new DeleteConfirmModal(this.app, item, async () => {
            try {
              await this.app.vault.trash(item, true);
              new Notice(`Deleted ${item instanceof TFolder ? item.name : item.basename}`);
              this.render();
            } catch (err) {
              new Notice(`Error deleting: ${err.message}`);
            }
          }).open();
        });
    });
    menu.showAtMouseEvent(e);
  }
  openCreateItemModal(type) {
    new CreateItemModal(this.app, type, this.currentPath, async (name) => {
      const parentPath = this.currentPath;
      if (type === "note") {
        const notePath = parentPath === "" ? `${name}.md` : `${parentPath}/${name}.md`;
        try {
          const newFile = await this.app.vault.create(notePath, "");
          new Notice(`Created note: ${name}`);
          this.openFile(newFile);
        } catch (err) {
          new Notice(`Error creating note: ${err.message}`);
        }
      } else {
        const folderPath = parentPath === "" ? name : `${parentPath}/${name}`;
        try {
          await this.app.vault.createFolder(folderPath);
          new Notice(`Created folder: ${name}`);
          this.render();
        } catch (err) {
          new Notice(`Error creating folder: ${err.message}`);
        }
      }
    }).open();
  }
  handleKeyDown(e) {
    if ((e.key === "N" || e.key === "n") && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      this.openCreateItemModal("note");
      return;
    }
    if ((e.key === "F" || e.key === "f") && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      this.openCreateItemModal("folder");
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Tab") {
      this.isCameraTracking = true;
    }
    if (e.ctrlKey && (e.key === " " || e.code === "Space")) {
      e.preventDefault();
      this.navigateToPath("");
      return;
    }
    const totalItems = this.filteredItems.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (totalItems > 0) {
        if (this.selectedIndex === -1) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex = (this.selectedIndex + 1) % totalItems;
        }
        this.renderItems();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (totalItems > 0) {
        if (this.selectedIndex === -1) {
          this.selectedIndex = totalItems - 1;
        } else {
          this.selectedIndex = (this.selectedIndex - 1 + totalItems) % totalItems;
        }
        this.renderItems();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (totalItems > 0) {
        const direction = e.shiftKey ? -1 : 1;
        if (this.selectedIndex === -1) {
          this.selectedIndex = direction === 1 ? 0 : totalItems - 1;
        } else {
          this.selectedIndex = (this.selectedIndex + direction + totalItems) % totalItems;
        }
        this.renderItems();
      }
    } else if (e.key === "ArrowRight" && !this.searchInput.value) {
      e.preventDefault();
      this.triggerSelectedAction();
    } else if (e.key === "ArrowLeft" && !this.searchInput.value) {
      e.preventDefault();
      this.navigateUp();
    } else if (e.key === "Enter") {
      e.preventDefault();
      this.triggerSelectedAction();
    } else if (e.key === "Backspace" && this.searchInput.value === "") {
      e.preventDefault();
      this.navigateUp();
    }
  }
  triggerSelectedAction() {
    if (this.filteredItems.length === 0 || this.selectedIndex < 0 || this.selectedIndex >= this.filteredItems.length) {
      return;
    }
    const selectedItem = this.filteredItems[this.selectedIndex];
    if (selectedItem instanceof TFolder) {
      this.navigateToPath(selectedItem.path);
    } else if (selectedItem instanceof TFile) {
      this.openFile(selectedItem);
    }
  }
  navigateUp() {
    if (this.currentPath === "") return;
    const parts = this.currentPath.split("/");
    parts.pop();
    const parentPath = parts.join("/");
    this.navigateToPath(parentPath);
  }
}

// =========================================================================
// Card Animation Engine (Self-Organizing Layout via Phyllotaxis + Spring)
// =========================================================================
class CardAnimationEngine {
  constructor(view, canvasEl, items, getZoom) {
    this.view = view;
    this.canvas = canvasEl;
    this.items = items;
    this.getZoom = getZoom;
    this.animId = null;
    this._lastTime = 0;

    // Physics parameters
    this.DRIFT_AMP = 0; // 0 drift
    this.SPRING_STIFFNESS = 170;
    this.SPRING_DAMPING = 14;
    this.BASE_SCALE = 1;
    this.SCALE_K = 0.08;

    if (this.items.length === 0) return;
    this._init();
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.items.forEach(item => {
      item.element.style.transform = "";
    });
  }

  _init() {
    this.items.forEach(item => {
      const el = item.element;
      const home = this._getHomePosition(item);
      item.home_left = home.x;
      item.home_top = home.y;

      // Start visually at home position to prevent top-left fly-in
      item.visual_x = item.home_left;
      item.visual_y = item.home_top;
      item.vx = 0;
      item.vy = 0;
      item.scale = this.BASE_SCALE + this.SCALE_K * Math.log(item.itemCount + 1);

      // Set card scale custom property for CSS transition fallback
      el.style.setProperty("--card-scale", item.scale);

      // Phase distribution for beautiful unique drift trajectories
      item.phase = item.index * 2.399; // Golden angle in radians
      item.freq_x = 2 * Math.PI * (0.05 + (item.index * 0.017) % 0.1);
      item.freq_y = 2 * Math.PI * (0.05 + (item.index * 0.023) % 0.1);
    });

    this._startLoop();
  }

  _getHomePosition(item) {
    return this.view.getItemPosition(item.path, item.index);
  }

  _startLoop() {
    const loop = (time) => {
      this._update(time);
      this._render();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  _update(time) {
    const dt = Math.min((time - (this._lastTime || time)) / 1000, 0.03);
    this._lastTime = time;

    const w = this.canvas.offsetWidth || this.view.sectionsContainerEl?.clientWidth || 800;
    const h = this.canvas.offsetHeight || this.view.sectionsContainerEl?.clientHeight || 600;
    const centerX = w / 2;
    const centerY = h / 2;

    // Identify which card is currently being dragged (if any, and only if drag actually started moving)
    const draggedItem = this.items.find(item => this.view.draggedElement === item.element && this.view.hasMoved === true);

    let draggedCenterX = 0;
    let draggedCenterY = 0;
    if (draggedItem) {
      const cardWidth = draggedItem.element.offsetWidth || 250;
      const cardHeight = draggedItem.element.offsetHeight || 130;
      const currentLeft = parseFloat(draggedItem.element.style.left) || 0;
      const currentTop = parseFloat(draggedItem.element.style.top) || 0;
      draggedCenterX = currentLeft + cardWidth / 2;
      draggedCenterY = currentTop + cardHeight / 2;
    }

    this.items.forEach(item => {
      const el = item.element;
      const home = this._getHomePosition(item);
      item.home_left = home.x;
      item.home_top = home.y;

      const isDragged = draggedItem === item;

      if (isDragged) {
        // When dragged, visual position follows DOM style coordinates exactly
        item.visual_x = parseFloat(el.style.left) || 0;
        item.visual_y = parseFloat(el.style.top) || 0;
      } else {
        // Keep cards static at their home/saved coordinates
        item.visual_x = item.home_left;
        item.visual_y = item.home_top;
      }
      item.vx = 0;
      item.vy = 0;
    });

    // Camera Panning Springs (Cinematic centering on selected card)
    const selectedItem = this.items.find(item => item.index === this.view.selectedIndex);
    if (this.view.isCameraTracking && selectedItem && !this.view.isPanning) {
      this.view.panVx = this.view.panVx || 0;
      this.view.panVy = this.view.panVy || 0;

      const Z = this.view.zoom;
      const cardWidth = selectedItem.element.offsetWidth || 250;
      const cardHeight = selectedItem.element.offsetHeight || 130;
      const cardCenterX = selectedItem.visual_x + cardWidth / 2;
      const cardCenterY = selectedItem.visual_y + cardHeight / 2;

      const targetPanX = centerX - cardCenterX * Z;
      const targetPanY = centerY - cardCenterY * Z;

      // Soft cinematic camera spring constants
      const cameraStiffness = 120;
      const cameraDamping = 18;

      const ax = -cameraStiffness * (this.view.panOffset.x - targetPanX) - cameraDamping * this.view.panVx;
      const ay = -cameraStiffness * (this.view.panOffset.y - targetPanY) - cameraDamping * this.view.panVy;

      this.view.panVx += ax * dt;
      this.view.panVy += ay * dt;
      this.view.panOffset.x += this.view.panVx * dt;
      this.view.panOffset.y += this.view.panVy * dt;

      // Keep smooth wheel target in sync during auto-tracking to prevent jumps
      this.view.targetPanOffset.x = this.view.panOffset.x;
      this.view.targetPanOffset.y = this.view.panOffset.y;

      this.view.updateZoomAndPanStyles();
    } else {
      this.view.panVx = 0;
      this.view.panVy = 0;
    }
  }

  _render() {
    const t = performance.now() / 1000;

    this.items.forEach(item => {
      const el = item.element;
      const L = parseFloat(el.style.left) || 0;
      const T = parseFloat(el.style.top) || 0;

      const isDragged = this.view.draggedElement === el && this.view.hasMoved === true;
      let driftX = 0;
      let driftY = 0;

      // Disable drift while dragging to avoid jitter
      if (!isDragged) {
        driftX = Math.sin(t * item.freq_x + item.phase) * this.DRIFT_AMP;
        driftY = Math.cos(t * item.freq_y + item.phase) * this.DRIFT_AMP;
      }

      // Compute visual displacement relative to DOM position
      const tx = item.visual_x - L + driftX;
      const ty = item.visual_y - T + driftY;

      if (Math.abs(tx) < 0.01 && Math.abs(ty) < 0.01) {
        // Clear transform to let CSS stylesheet animations/hover properties control the card
        el.style.transform = "";
      } else {
        el.style.transform = `translate(${tx}px, ${ty}px) scale(${item.scale})`;
      }
    });
  }
}

class FolderDashboardPlugin extends Plugin {
  async onload() {
    this.settings = Object.assign({
      folderViewModes: {
        "": "board",
        "GARBAGE": "dashboard",
        "SCRATCH": "dashboard"
      },
      boardPositions: {
        "": {
          "Archives": { "x": -281, "y": 28 },
          "INFerno": { "x": 10, "y": 23 },
          "GARBAGE": { "x": 472, "y": 159 },
          "KNOWLEDGE": { "x": 639, "y": 24 },
          "PERMANENT": { "x": -156, "y": 177 },
          "PROGRESS": { "x": 7, "y": 323 },
          "PROJECTS": { "x": 45, "y": 311 },
          "Statements.md": { "x": 324, "y": 20 },
          "Utopia tpp.md": { "x": 725, "y": 167 },
          "SCRATCH": { "x": 631, "y": 301 },
          "STUDIO": { "x": 154, "y": 172 },
          "03 Permanent notes": { "x": 52, "y": 170 },
          "Reflection.md": { "x": 331, "y": 312 },
          "Calender": { "x": 452, "y": 164 }
        }
      }
    }, await this.loadData());

    this.registerView(
      VIEW_TYPE,
      (leaf) => new FolderDashboardView(leaf, this)
    );

    this.addRibbonIcon("folder", "Open Folder Dashboard", () => {
      this.activateView();
    });

    this.addCommand({
      id: "open-folder-dashboard",
      name: "Open Folder Dashboard",
      callback: () => {
        this.activateView();
      }
    });

    // Ctrl+Space Command to open Folder Dashboard Root
    this.addCommand({
      id: "open-folder-dashboard-root",
      name: "Open Folder Dashboard Root",
      hotkeys: [{ modifiers: ["Ctrl"], key: " " }],
      callback: () => {
        this.activateViewAndNavigate("");
      }
    });

    // Alt+Space Command to open Folder Dashboard Global Search
    this.addCommand({
      id: "open-folder-dashboard-global-search",
      name: "Search all folders and files",
      hotkeys: [{ modifiers: ["Alt"], key: " " }],
      callback: () => {
        this.activateViewAndStartGlobalSearch();
      }
    });

    // Alt+Left Command to go to parent directory
    this.addCommand({
      id: "folder-dashboard-go-up",
      name: "Go to parent directory",
      hotkeys: [{ modifiers: ["Alt"], key: "ArrowLeft" }],
      callback: () => {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile) {
          const parentFolder = activeFile.parent;
          const parentPath = (parentFolder && parentFolder.path !== "/" && parentFolder.path !== "") ? parentFolder.path : "";
          this.activateViewAndNavigate(parentPath);
        } else {
          const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
          if (leaf && leaf.view instanceof FolderDashboardView) {
            leaf.view.navigateUp();
          }
        }
      }
    });

    this.registerEvent(
      this.app.workspace.on("active-leaf-change", (leaf) => {
        if (leaf && leaf.view && leaf.view.getViewType() === "empty") {
          leaf.setViewState({
            type: VIEW_TYPE,
            active: true
          });
        }
        this.updateAllBreadcrumbs();
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        this.updateAllBreadcrumbs();
      })
    );

    this.registerEvent(
      this.app.workspace.on("layout-change", () => {
        this.updateAllBreadcrumbs();
      })
    );

    this.app.workspace.onLayoutReady(() => {
      this.updateAllBreadcrumbs();
    });
  }

  updateAllBreadcrumbs() {
    const { workspace } = this.app;
    
    // Update markdown views
    const markdownLeaves = workspace.getLeavesOfType("markdown");
    markdownLeaves.forEach(leaf => {
      this.updateMarkdownLeafBreadcrumbs(leaf);
    });

    // Update folder dashboard views
    const dashboardLeaves = workspace.getLeavesOfType(VIEW_TYPE);
    dashboardLeaves.forEach(leaf => {
      if (leaf.view instanceof FolderDashboardView) {
        leaf.view.renderBreadcrumbs();
      }
    });
  }

  updateMarkdownLeafBreadcrumbs(leaf) {
    if (!leaf || !leaf.view || leaf.view.getViewType() !== "markdown") return;
    
    const file = leaf.view.file;
    if (!file) return;

    const containerEl = leaf.view.containerEl;
    if (!containerEl) return;

    const renderHeader = () => {
      let fileHeader = containerEl.querySelector(".inferno-file-header");
      const viewContent = containerEl.querySelector(".view-content");
      
      if (!fileHeader) {
        fileHeader = document.createElement("div");
        fileHeader.className = "inferno-file-header";
        if (viewContent) {
          containerEl.insertBefore(fileHeader, viewContent);
        } else {
          containerEl.appendChild(fileHeader);
        }
      } else if (viewContent && fileHeader.nextElementSibling !== viewContent) {
        containerEl.insertBefore(fileHeader, viewContent);
      }

      // Now populate it using the helper
      createBreadcrumbsDOM(
        fileHeader, 
        file.path, 
        true, 
        (targetPath) => this.activateViewAndNavigate(targetPath),
        (targetPath, e) => {
          if (e.shiftKey) {
            this.revealInLeftExplorer(targetPath);
          } else if (e.ctrlKey || e.metaKey) {
            this.activateViewAndNavigateRight(targetPath);
          } else {
            this.activateViewAndNavigateNewTab(targetPath);
          }
        }
      );
    };

    // Render immediately
    renderHeader();

    // Setup MutationObserver if not already observed
    if (!leaf._inferno_observed) {
      leaf._inferno_observed = true;
      
      const observer = new MutationObserver(() => {
        const fileHeader = containerEl.querySelector(".inferno-file-header");
        const viewContent = containerEl.querySelector(".view-content");
        
        if (!fileHeader || (viewContent && fileHeader.nextElementSibling !== viewContent)) {
          observer.disconnect();
          renderHeader();
          observer.observe(containerEl, { childList: true, subtree: true });
        }
      });
      
      observer.observe(containerEl, { childList: true, subtree: true });
      leaf._inferno_observer = observer;
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const { workspace } = this.app;
    
    let leaf = workspace.getActiveViewOfType(MarkdownView)?.leaf || workspace.getActiveViewOfType(FolderDashboardView)?.leaf;
    if (!leaf) {
      leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    }
    if (!leaf) {
      const rightLeaf = workspace.getLeaf(false);
      if (rightLeaf) {
        await rightLeaf.setViewState({ type: VIEW_TYPE, active: true });
        leaf = rightLeaf;
      }
    }
    
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
      workspace.revealLeaf(leaf);
    }
  }

  async activateViewAndNavigate(path) {
    const { workspace } = this.app;
    
    let leaf = workspace.getActiveViewOfType(MarkdownView)?.leaf || workspace.getActiveViewOfType(FolderDashboardView)?.leaf;
    if (!leaf) {
      leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    }
    if (!leaf) {
      const rightLeaf = workspace.getLeaf(false);
      if (rightLeaf) {
        await rightLeaf.setViewState({ type: VIEW_TYPE, active: true });
        leaf = rightLeaf;
      }
    }
    
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
      workspace.revealLeaf(leaf);
      const view = leaf.view;
      if (view instanceof FolderDashboardView) {
        view.navigateToPath(path);
      }
    }
  }

  async activateViewAndNavigateRight(path) {
    const { workspace } = this.app;
    
    const rightLeaf = workspace.getLeaf('split', 'vertical');
    if (rightLeaf) {
      await rightLeaf.setViewState({ type: VIEW_TYPE, active: true });
      workspace.revealLeaf(rightLeaf);
      const view = rightLeaf.view;
      if (view instanceof FolderDashboardView) {
        view.navigateToPath(path);
      }
    }
    
    this.revealInLeftExplorer(path);
  }

  revealInLeftExplorer(path) {
    const file = path === "" ? this.app.vault.getRoot() : this.app.vault.getAbstractFileByPath(path);
    if (!file) return;
    
    const leaves = this.app.workspace.getLeavesOfType("file-explorer");
    if (leaves.length > 0) {
      const leaf = leaves[0];
      this.app.workspace.revealLeaf(leaf);
      if (leaf.view && typeof leaf.view.revealInFolder === "function") {
        try {
          leaf.view.revealInFolder(file);
        } catch (e) {
          console.error("Error revealing folder in file explorer:", e);
        }
      }
    }
  }

  async activateViewAndNavigateNewTab(path) {
    const { workspace } = this.app;
    
    const newLeaf = workspace.getLeaf('tab');
    if (newLeaf) {
      await newLeaf.setViewState({ type: VIEW_TYPE, active: true });
      workspace.revealLeaf(newLeaf);
      const view = newLeaf.view;
      if (view instanceof FolderDashboardView) {
        view.navigateToPath(path);
      }
    }
    
    this.revealInLeftExplorer(path);
  }

  async activateViewAndStartGlobalSearch() {
    const { workspace } = this.app;
    
    let leaf = workspace.getActiveViewOfType(MarkdownView)?.leaf || workspace.getActiveViewOfType(FolderDashboardView)?.leaf;
    if (!leaf) {
      leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
    }
    if (!leaf) {
      const rightLeaf = workspace.getLeaf(false);
      if (rightLeaf) {
        await rightLeaf.setViewState({ type: VIEW_TYPE, active: true });
        leaf = rightLeaf;
      }
    }
    
    if (leaf) {
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
      workspace.revealLeaf(leaf);
      const view = leaf.view;
      if (view instanceof FolderDashboardView) {
        view.startGlobalSearch();
      }
    }
  }

  onunload() {
    const leaves = this.app.workspace.getLeavesOfType("markdown");
    leaves.forEach(leaf => {
      if (leaf._inferno_observer) {
        leaf._inferno_observer.disconnect();
        delete leaf._inferno_observer;
      }
      delete leaf._inferno_observed;
    });

    document.querySelectorAll(".inferno-file-breadcrumb").forEach(el => el.remove());
    document.querySelectorAll(".inferno-file-header").forEach(el => el.remove());
    document.querySelectorAll(".inferno-breadcrumb-container").forEach(el => el.remove());
  }
}

module.exports = FolderDashboardPlugin;

  
  return module.exports.default || module.exports;
})();

// =========================================================================
// MAIN WRAPPER PLUGIN: Inferno Customizer Hub
// =========================================================================
module.exports = class InfernoCustomizerPlugin extends Plugin {
  async onload() {
    console.log("Loading Inferno Customizer Hub...");

    this.subPlugins = {};
    this.subSettingTabs = [];

    // Helper to wrap a plugin instance
    const initSubPlugin = (name, PluginClass, key) => {
      try {
        const instance = new PluginClass(this.app, this.manifest);
        
        // Override data loading and saving to use our namespaced settings
        instance.loadData = async () => {
          const mainData = await this.loadData() || {};
          return mainData[key] || {};
        };
        instance.saveData = async (subData) => {
          const mainData = await this.loadData() || {};
          mainData[key] = subData;
          await this.saveData(mainData);
        };
        
        // Intercept settings tab registration
        instance.addSettingTab = (tab) => {
          this.subSettingTabs.push({ name, tab, key });
        };

        this.subPlugins[key] = instance;
      } catch (err) {
        console.error(`Failed to initialize sub-plugin ${name}:`, err);
      }
    };

    // Instantiate sub-plugins
    initSubPlugin("Folder Dashboard", FolderDashboardPluginClass, "dashboard");

    // Load main settings
    this.settings = await this.loadSettings();

    // Run migrations if needed
    await this.migrateSettingsIfNeeded();

    // Call onload on all sub-plugins
    for (const key in this.subPlugins) {
      try {
        await this.subPlugins[key].onload();
      } catch (err) {
        console.error(`Error loading sub-plugin ${key}:`, err);
      }
    }

    // Register our unified settings tab
    this.addSettingTab(new InfernoCustomizerSettingTab(this.app, this));

    // Register mouse-based sidebar toggle command
    this.addCommand({
      id: "toggle-sidebar-by-mouse",
      name: "Toggle sidebar based on mouse position",
      hotkeys: [{ modifiers: ["Mod"], key: "\\" }],
      callback: () => {
        const mouseX = this.lastMouseX;
        if (mouseX == null) return;
        const mid = window.innerWidth / 2;
        if (mouseX < mid) {
          this.app.workspace.leftSplit.toggle();
        } else {
          this.app.workspace.rightSplit.toggle();
        }
      }
    });

    document.addEventListener("mousemove", (e) => {
      this.lastMouseX = e.clientX;
    });

    // Inject custom styling from settings when layout is ready
    this.app.workspace.onLayoutReady(() => {
      this.injectStyles();
    });

    // Listen to theme or snippet changes and re-inject print styles
    this.registerEvent(
      this.app.workspace.on("css-change", () => {
        this.injectStyles();
      })
    );
  }

  async migrateSettingsIfNeeded() {
    const mainData = await this.loadData() || {};
    let modified = false;

    const migrations = [
    ];

    for (const mig of migrations) {
      if (!mainData[mig.key]) {
        try {
          const exists = await this.app.vault.adapter.exists(mig.path);
          if (exists) {
            const raw = await this.app.vault.adapter.read(mig.path);
            mainData[mig.key] = JSON.parse(raw);
            modified = true;
            console.log(`Migrated settings for ${mig.key} from ${mig.path}`);
          }
        } catch (e) {
          console.warn(`Could not migrate settings for ${mig.key}:`, e);
        }
      }
    }

    if (modified) {
      await this.saveData(mainData);
    }
  }

  onunload() {
    console.log("Unloading Inferno Customizer Hub...");
    // Call onunload on all sub-plugins
    for (const key in this.subPlugins) {
      try {
        if (this.subPlugins[key].onunload) {
          this.subPlugins[key].onunload();
        }
      } catch (err) {
        console.error(`Error unloading sub-plugin ${key}:`, err);
      }
    }

    // Clean up style injection
    const styleEl = document.getElementById("inferno-customizer-dynamic-styles");
    if (styleEl) styleEl.remove();
  }

  async loadSettings() {
    const data = await this.loadData() || {};
    
    // Default custom styles settings
    if (!data.customStyles) {
      data.customStyles = {
        hideAttachments: true,
        attachmentsPath: "attachments",
        hideIcons: true,
        hideSearchAndBookmarks: true,
        hideFileExplorerButtons: true,
        mermaidResize: true,
        mermaidMaxWidth: "600px",
        sideToggle: true
      };
      await this.saveData(data);
    }
    return data;
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.injectStyles();
  }

  async injectStyles() {
    let styleEl = document.getElementById("inferno-customizer-dynamic-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "inferno-customizer-dynamic-styles";
      document.head.appendChild(styleEl);
    }

    const s = this.settings.customStyles || {};
    let css = "";

    // 5. Hide attachments folder
    if (s.hideAttachments) {
      const path = s.attachmentsPath || "attachments";
      css += `
        .nav-folder-title[data-path$="/${path}"],
        .nav-folder[data-path$="/${path}"] {
          display: none !important;
        }
      `;
    }

    // 6. Hide ribbon icons
    if (s.hideIcons) {
      css += `
        .side-dock-ribbon .side-dock-ribbon-action:not([aria-label="Open today"]) {
            display: none !important;
        }
      `;
    }

    // 7. Hide Search & Bookmarks
    if (s.hideSearchAndBookmarks) {
      css += `
        [aria-label="Search"],
        [aria-label="Bookmarks"] {
            display: none !important;
        }
      `;
    }

    // 8. Hide File Explorer buttons
    if (s.hideFileExplorerButtons) {
      css += `
        .nav-buttons-container .clickable-icon:not([aria-label="Collapse all"]) {
            display: none !important;
        }
      `;
    }

    // 9. Mermaid diagram resize
    if (s.mermaidResize) {
      const maxW = s.mermaidMaxWidth || "600px";
      css += `
        .mermaid svg {
            max-width: ${maxW} !important;
            height: auto !important;
        }
      `;
    }



    styleEl.textContent = css;

    // 15. Dynamic PDF Export print styles to match active theme exactly
    try {
      const isDark = document.body.classList.contains("theme-dark");
      const bodyStyle = getComputedStyle(document.body);
      const bg = bodyStyle.getPropertyValue("--background-primary").trim();
      const text = bodyStyle.getPropertyValue("--text-normal").trim();
      const border = bodyStyle.getPropertyValue("--background-modifier-border").trim();
      const link = bodyStyle.getPropertyValue("--link-color").trim();
      const fontText = bodyStyle.getPropertyValue("--font-text").trim() || "'Outfit', sans-serif";
      const fontHeadings = bodyStyle.getPropertyValue("--font-headings").trim() || "'Outfit', sans-serif";

      if (bg && text) {
        let printCss = `
          @media print {
            *, *::before, *::after {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body.print,
            body.print .markdown-preview-view,
            body.print .markdown-preview-sizer,
            body.print .markdown-rendered {
              background-color: ${bg} !important;
              color: ${text} !important;
            }
            body.print *,
            body.print .markdown-preview-view *,
            body.print .markdown-rendered * {
              font-family: ${fontText} !important;
            }
            body.print p, 
            body.print span, 
            body.print div, 
            body.print li, 
            body.print ul, 
            body.print ol,
            body.print .cm-line {
              color: inherit !important;
            }
            body.print h1, body.print h2, body.print h3, body.print h4, body.print h5, body.print h6, body.print .inline-title {
              font-family: ${fontHeadings} !important;
              color: ${text} !important;
            }
            body.print a, body.print a.internal-link, body.print a.external-link {
              color: ${link || text} !important;
              text-decoration: none !important;
            }
            body.print table {
              border-collapse: collapse !important;
              border: 1px solid ${border} !important;
              background-color: ${isDark ? "#1a1a1a" : "#ffffff"} !important;
            }
            body.print th {
              border: 1px solid ${border} !important;
              color: ${text} !important;
              background-color: ${isDark ? "#141414" : "#f5f5f5"} !important;
            }
            body.print td {
              border: 1px solid ${border} !important;
              color: inherit !important;
            }
            body.print hr {
              border: none !important;
              border-top: 1px solid ${border} !important;
            }
            body.print code, body.print pre {
              color: ${text} !important;
              border: 1px solid ${border} !important;
              background-color: ${isDark ? "#0a0a0a" : "#f5f5f5"} !important;
            }
          }
        `;

        const snippetPath = ".obsidian/snippets/pdf-theme-fix.css";
        const exists = await this.app.vault.adapter.exists(snippetPath);
        let currentContent = "";
        if (exists) {
          currentContent = await this.app.vault.adapter.read(snippetPath);
        }
        if (currentContent !== printCss) {
          await this.app.vault.adapter.write(snippetPath, printCss);
          this.app.workspace.updateOptions();
        }
      }
    } catch (e) {
      console.warn("Failed to generate dynamic PDF print styles:", e);
    }
  }
};

class InfernoCustomizerSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();

    const s = this.plugin.settings.customStyles || {};

    containerEl.createEl("h3", { text: "UI Customisations" });

    new Setting(containerEl)
      .setName("Hide attachments folder")
      .setDesc("Toggle showing/hiding attachments directory in explorer.")
      .addToggle(cb => cb.setValue(s.hideAttachments).onChange(async val => {
        s.hideAttachments = val;
        await this.plugin.saveSettings();
      }))
      .addText(cb => cb.setPlaceholder("attachments").setValue(s.attachmentsPath).onChange(async val => {
        s.attachmentsPath = val;
        await this.plugin.saveSettings();
      }));

    new Setting(containerEl)
      .setName("Hide ribbon icons")
      .setDesc("Hide sidebar options ribbon (except Calendar icon).")
      .addToggle(cb => cb.setValue(s.hideIcons).onChange(async val => {
        s.hideIcons = val;
        await this.plugin.saveSettings();
      }));

    new Setting(containerEl)
      .setName("Hide search & bookmarks")
      .setDesc("Hide Search and Bookmarks shortcuts from top header bar.")
      .addToggle(cb => cb.setValue(s.hideSearchAndBookmarks).onChange(async val => {
        s.hideSearchAndBookmarks = val;
        await this.plugin.saveSettings();
      }));

    new Setting(containerEl)
      .setName("Hide file explorer top buttons")
      .setDesc("Hide options in file explorer header (except Collapse all icon).")
      .addToggle(cb => cb.setValue(s.hideFileExplorerButtons).onChange(async val => {
        s.hideFileExplorerButtons = val;
        await this.plugin.saveSettings();
      }));

    new Setting(containerEl)
      .setName("Mermaid diagram resize")
      .setDesc("Scale Mermaid blocks to specified max-width limit.")
      .addToggle(cb => cb.setValue(s.mermaidResize).onChange(async val => {
        s.mermaidResize = val;
        await this.plugin.saveSettings();
      }))
      .addText(cb => cb.setPlaceholder("600px").setValue(s.mermaidMaxWidth).onChange(async val => {
        s.mermaidMaxWidth = val;
        await this.plugin.saveSettings();
      }));

    containerEl.createEl("h3", { text: "Shortcuts" });

    new Setting(containerEl)
      .setName("Toggle sidebar by mouse position")
      .setDesc("Toggles the left or right sidebar based on which half of the screen the mouse is on. (Default: Ctrl+\\)")
      .addToggle(cb => cb.setValue(s.sideToggle).onChange(async val => {
        s.sideToggle = val;
        await this.plugin.saveSettings();
      }));

    this.plugin.subSettingTabs.forEach(({ name, tab, key }) => {
      containerEl.createEl("h3", { text: `Plugin: ${name}` });
      tab.containerEl = containerEl;
      try {
        tab.display();
      } catch (e) {
        console.error(`Error displaying setting tab for ${name}:`, e);
        containerEl.createEl("p", { text: `Failed to load settings tab for ${name}.` });
      }
    });
  }
}
