const { Plugin, PluginSettingTab, Setting, Modal, Notice } = require('obsidian');

// =========================================================================
// SUB-PLUGIN 1: Typewriter Mode (IIFE Wrapped)
// =========================================================================
const TypewriterPluginClass = (function() {
  const exports = {};
  const module = { exports };
  
  var{defineProperty:st,getOwnPropertyNames:li,getOwnPropertyDescriptor:ci}=Object,ui=Object.prototype.hasOwnProperty;var kt=new WeakMap,yi=(t)=>{var i=kt.get(t),e;if(i)return i;if(i=st({},"__esModule",{value:!0}),t&&typeof t==="object"||typeof t==="function")li(t).map((r)=>!ui.call(i,r)&&st(i,r,{get:()=>t[r],enumerable:!(e=ci(t,r))||e.enumerable}));return kt.set(t,i),i};var bi=(t,i)=>{for(var e in i)st(t,e,{get:i[e],enumerable:!0,configurable:!0,set:(r)=>i[e]=()=>r})};var Li={};bi(Li,{default:()=>Pt});module.exports=yi(Li);var hi=require("obsidian");var T=`<!-- markdownlint-disable -->
**Thank you for using Typewriter Mode!** If you like the plugin, please consider supporting me on [GitHub Sponsors](https://github.com/sponsors/davisriedel) or [buy me a coffee](https://www.buymeacoffee.com/davis.riedel). I am a computer science student and develop this plugin in my spare time. Your support will ensure the continuous development and maintenance of the plugin. <br> <a href="https://www.buymeacoffee.com/davis.riedel" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;"></a> <br>
If you find any bugs or have a feature request, please don't hesitate to [open an issue on GitHub](https://github.com/davisriedel/obsidian-typewriter-mode/issues). You are also welcome to contribute to the project.
`;var Kt=`# Typewriter Mode updated to v{{tag-name}}

{{funding}}

## What's new?

Here's what's new since the last version you had installed:

***

{{release-notes}}
`;var $t=require("obsidian"),x=require("obsidian");async function Ci(t,i,e,r){let n=await fetch(`https://api.github.com/repos/${t}/${i}/releases`),o=await n.json();if(!n.ok&&"message"in o||!Array.isArray(o))throw new Error(`Failed to fetch releases: ${o.message??"Unknown error"}`);if(e==null)return o.filter((d)=>!d.draft&&!d.prerelease);let m=o.findIndex((d)=>d.tag_name===e);if(m===-1)throw new Error(`Could not find release with tag ${e}`);return o.slice(0,m).filter((d)=>!d.draft&&(r||!d.prerelease))}class mt extends x.Modal{currentVersion;previousVersion;constructor(t,i,e){super(t);this.currentVersion=i;this.previousVersion=e}fetchAndDisplayReleaseNotes(){let t=this.currentVersion.includes("-");Ci("davisriedel","obsidian-typewriter-mode",this.previousVersion,t).then((i)=>{if(i.length===0)this.displayError(new Error("No new releases found"));else this.displayReleaseNotes(i)}).catch((i)=>{this.displayError(i)})}onOpen(){let{contentEl:t}=this;t.empty(),t.createEl("h2",{text:"Fetching release notes..."}),this.fetchAndDisplayReleaseNotes()}displayReleaseNotes(t){let{contentEl:i}=this;i.empty(),i.classList.add("ptm-update-modal-container");let e=i.createDiv("ptm-update-modal"),r=t.map((o)=>`### ${o.tag_name}

${o.body}`).join(`
---
`),n=Kt.replace("{{tag-name}}",t[0].tag_name).replace("{{funding}}",T).replace("{{release-notes}}",r);x.MarkdownRenderer.render(this.app,n,e,this.app.vault.getRoot().path,new $t.Component)}displayError(t){let{contentEl:i}=this;i.empty(),i.classList.add("ptm-update-modal-container"),i.createDiv("ptm-update-modal").createEl("h2",{text:t.message})}}function l(t){return t.dom.ownerDocument.querySelector(".workspace-leaf.mod-active .cm-editor, .mod-inside-iframe .cm-editor")}function C(t){return t.dom.ownerDocument.querySelector(".workspace-leaf.mod-active .cm-scroller, .mod-inside-iframe .cm-scroller")}function dt(t){return t.dom.ownerDocument.querySelector(".workspace-leaf.mod-active .cm-sizer, .mod-inside-iframe .cm-sizer")}class at{tm;view;constructor(t,i){this.tm=t,this.view=i}getActiveLineProp(t){let i=this.view.contentDOM.querySelector(".cm-active.cm-line")?.getCssPropertyValue(t).replace("px","");if(!i)return null;return Number.parseFloat(i)}getActiveLineOffset(t){let i=t.top,e=l(this.view);if(!e)return 0;let r=e.getBoundingClientRect().top;return i-r}getTypewriterOffset(){let t=l(this.view);if(!t)return 0;return t.clientHeight*this.tm.settings.typewriterOffset}getTypewriterPositionData(){let t=this.view.coordsAtPos(this.view.state.selection.main.head);if(!t)return null;let i=t.bottom-t.top,e=this.getActiveLineProp("line-height");if(!e)return null;let r=0,n=0;if(i>e)r=i,n=0;else r=e,n=(r-i)/2;let o=this.getTypewriterOffset(),m=this.getActiveLineOffset(t),{isTypewriterScrollEnabled:d,isKeepLinesAboveAndBelowEnabled:g,isOnlyMaintainTypewriterOffsetWhenReachedEnabled:y}=this.tm.settings,p=l(this.view),h=C(this.view),c;if(!p||!h)c=0;else if(d){if(c=o,y)if(m<0)c=0;else c=h.scrollTop+m<o?Math.min(o,m):o}else if(g){let{linesAboveAndBelow:Ht}=this.tm.settings,At=this.view.defaultLineHeight*Ht,Ut=p.clientHeight-this.view.defaultLineHeight*(Ht+1),pi=h.scrollTop!==0&&m<At,gi=m>Ut;if(pi)c=At;else if(gi)c=Ut;else c=m}else c=this.getActiveLineOffset(t);return{typewriterOffset:o,scrollOffset:c,activeLineOffset:m,lineHeight:r,lineOffset:n}}}var Vt=require("@codemirror/state"),Wt=require("@codemirror/state"),L=require("@codemirror/view"),M=require("obsidian");var ht=require("@codemirror/view");function vt(t,i,e){let r=!1;for(let n of i)if(t.slice(e+1-n.length,e+1)===n){r=!0;break}return r}function Ot(t,i,e){let r=t.sentenceDelimiters.split(""),n=t.extraCharacters.split(""),o=t.ignoredPatterns.split(`
`),m=i.from,d=i.text,g=-1;for(let p=e-m-1;p>=0;p--)if(r.contains(d[p])){if(vt(d,o,p))continue;let h=1;while(d[p+h]===" "&&h<e-m-1)h+=1;while(n.contains(d[p+h])&&r.contains(d[p+h-1])&&h<e-m-1)h+=1;g=p+h;break}if(g===-1)g=0;let y=-1;for(let p=e-m;p<i.length;p++)if(r.contains(d[p])){if(vt(d,o,p))continue;let h=1;while(r.contains(d[p+h])&&h<i.length)h+=1;while(n.contains(d[p+h])&&h<i.length)h+=1;y=p+h;break}if(y!==-1)return{start:g+m,end:y+m};return{start:g+m,end:null}}function Ft(t,i){let e=[],n=t.state.selection.main.from,o=t.state.doc.lineAt(n),m=Ot(i,o,n);if(m.end==null){if(n>o.from)m=Ot(i,o,n-1)}let{start:d,end:g}=m;if(g==null)g=o.to;function y(p,h,c){e.push(ht.Decoration.mark({inclusive:!0,attributes:{},class:c}).range(p,h))}if(d!==g){if(y(d,g,"active-sentence"),o.from!==d)y(o.from,d,"active-paragraph");if(g!==o.to)y(g,o.to,"active-paragraph")}return ht.Decoration.set(e,!0)}var pt="ptm-current-line",gt="ptm-current-line-fade-before",lt="ptm-current-line-fade-after";class It{tm;view;domResizeObserver=null;onScrollEventKey;isListeningToOnScroll=!1;isOnScrollClassSet=!1;isInitialInteraction=!0;isRenderingAllowedUserEvent=!1;decorations=Vt.RangeSet.empty;isPerWindowPropsReloadRequired=!1;constructor(t,i){this.tm=t,this.view=i,this.onScrollEventKey=M.Platform.isMobile?"touchmove":"wheel",this.onLoad()}destroy(){this.domResizeObserver?.disconnect(),this.destroyCurrentLine(),this.removeScrollListener(),window.removeEventListener("moveByCommand",this.moveByCommand.bind(this))}onLoad(){this.domResizeObserver=new ResizeObserver(this.onResize.bind(this)),this.domResizeObserver.observe(this.view.dom.ownerDocument.body),window.addEventListener("moveByCommand",this.moveByCommand.bind(this)),this.watchEmbeddedMarkdown(),this.onReconfigured(),window.requestAnimationFrame(()=>{this.restoreCursorPosition(this.view)})}userEventAllowed(t){let i=/^(select|input|delete|undo|redo)(\..+)?$/,e=/^(select.pointer)$/;if(this.tm.settings.isTypewriterOnlyUseCommandsEnabled)i=/^(input|delete|undo|redo)(\..+)?$/,e=/^(select)(\..+)?$/;return i.test(t)&&!e.test(t)}inspectTransactions(t){let i=[],e=!1;for(let n of t.transactions){if(n.reconfigured)e=!0;let o=n.annotation(Wt.Transaction.userEvent);if(o!==void 0)i.push(o)}if(i.length===0)return{isReconfigured:e,isUserEvent:!1,allowedUserEvents:null};return{isReconfigured:!1,isUserEvent:!0,allowedUserEvents:i.reduce((n,o)=>{return n&&this.userEventAllowed(o)},i.length>0)}}update(t){let{isReconfigured:i,isUserEvent:e,allowedUserEvents:r}=this.inspectTransactions(t);if(this.isTableCell())return;if(i)this.onReconfigured();if(this.isDisabled())return;if(!e){this.updateNonUserEvent();return}r?this.updateAllowedUserEvent():this.updateDisallowedUserEvent()}isTableCell(){return this.view.dom.parentElement?.parentElement?.className.contains("table-cell-wrapper")??!1}isMarkdownFile(){let t=this.tm.plugin.app.workspace.getActiveViewOfType(M.ItemView);if(!t)return this.isPerWindowPropsReloadRequired=!0,!1;return t.getViewType()==="markdown"}isDisabledInFrontmatter(){let t=this.tm.plugin.app.workspace.getActiveFile();if(!t)return this.isPerWindowPropsReloadRequired=!0,!1;let i=this.tm.plugin.app.metadataCache.getFileCache(t)?.frontmatter;if(!i)return!1;if(!Object.hasOwn(i,"typewriter-mode"))return!1;return!i["typewriter-mode"]}isDisabled(){if(!this.tm.settings.isPluginActivated)return!0;if(!this.isMarkdownFile())return!0;if(this.isDisabledInFrontmatter())return!0}onReconfigured(){if(this.isPerWindowPropsReloadRequired=!0,this.isDisabled())this.destroyCurrentLine(),this.resetPadding(this.view),this.loadPerWindowProps();else this.updateAfterExternalEvent()}watchEmbeddedMarkdown(){let i=this.tm.perWindowProps;new MutationObserver((r)=>{r.forEach((n)=>{[].forEach.call(n.addedNodes,(o)=>{if(o.nodeType===Node.ELEMENT_NODE&&o.matches(".markdown-embed-content iframe.embed-iframe")){let m=o.contentDocument?.body;if(!m)return;this.loadPerWindowPropsOnElement(i,m)}})})}).observe(this.view.dom.ownerDocument,{childList:!0,subtree:!0})}loadPerWindowPropsOnElement(t,i){for(let e of t.allBodyClasses)i.classList.remove(e);if(i.addClasses(t.persistentBodyClasses),!this.isDisabled())i.addClasses(t.bodyClasses);i.setCssProps(t.cssVariables),i.setAttrs(t.bodyAttrs)}getMarkdownBodies(){let t=this.view.dom.ownerDocument.querySelectorAll(".markdown-embed-content iframe.embed-iframe"),i=Array.from(t).flatMap((e)=>{let r=e.contentDocument?.body;return r?[r]:[]});return[this.view.dom.ownerDocument.body,...i]}loadPerWindowProps(){if(!this.isPerWindowPropsReloadRequired)return;this.isPerWindowPropsReloadRequired=!1;let t=this.getMarkdownBodies();for(let i of t)this.loadPerWindowPropsOnElement(this.tm.perWindowProps,i)}loadCurrentLine(t=this.view){let i=l(t);if(!i)return null;let e=i.querySelector(`.${pt}`);if(!e)e=document.createElement("div"),e.className=pt,i.appendChild(e);if(this.tm.settings.isFadeLinesEnabled){let r=i.querySelector(`.${gt}`),n=i.querySelector(`.${lt}`);if(!r)r=document.createElement("div"),r.className=gt,i.appendChild(r);if(!n)n=document.createElement("div"),n.className=lt,i.appendChild(n);return{currentLine:e,fadeBefore:r,fadeAfter:n}}return{currentLine:e}}destroyCurrentLine(t=this.view){let i=l(t);if(!i)return;let e=i.querySelector(`.${pt}`),r=i.querySelector(`.${gt}`),n=i.querySelector(`.${lt}`);e?.remove(),r?.remove(),n?.remove()}setupScrollListener(){if(this.isListeningToOnScroll)return;let t=C(this.view);if(t)t.addEventListener(this.onScrollEventKey,this.onScroll.bind(this),{passive:!0}),this.isListeningToOnScroll=!0}removeScrollListener(){if(!this.isListeningToOnScroll)return;let t=C(this.view);if(t)t.removeEventListener(this.onScrollEventKey,this.onScroll),this.isListeningToOnScroll=!1}measureTypewriterPosition(t,i){this.view.requestMeasure({key:t,read:(e)=>new at(this.tm,e).getTypewriterPositionData(),write:(e,r)=>{if(!e)return;window.requestAnimationFrame(()=>{i(e,r)})}})}updateAllowedUserEvent(){this.removeScrollListener(),this.applyDecorations();let t=l(this.view);if(t){if(t.classList.remove("ptm-scroll"),this.isOnScrollClassSet=!1,t.classList.remove("ptm-select"),this.isInitialInteraction)t.classList.remove("ptm-first-open"),this.isInitialInteraction=!1}this.isRenderingAllowedUserEvent=!0,this.measureTypewriterPosition("TypewriterModeUpdateAfterAllowedUserEvent",(i,e)=>{if(!i)return;this.recenterAndMoveCurrentLine(e,i),this.isRenderingAllowedUserEvent=!1,this.handleCursorStateUpdate(e)})}updateDisallowedUserEvent(){if(this.isRenderingAllowedUserEvent)return;let t=l(this.view);if(t){if(this.isInitialInteraction)t.classList.remove("ptm-first-open"),this.isInitialInteraction=!1;t.classList.add("ptm-select")}this.measureTypewriterPosition("TypewriterModeUpdateAfterDisallowedUserEvent",(i,e)=>{if(!i)return;this.handleCursorStateUpdate(e);let{activeLineOffset:r,lineHeight:n,lineOffset:o}=i;if(this.tm.settings.isHighlightCurrentLineEnabled||this.tm.settings.isFadeLinesEnabled)this.moveCurrentLine(e,r,o,n)})}updateNonUserEvent(){if(this.applyDecorations(),!this.isInitialInteraction)return;if(this.tm.settings.isOnlyActivateAfterFirstInteractionEnabled){let t=l(this.view);if(t)t.classList.add("ptm-first-open")}}moveByCommand(){let t=l(this.view);if(t)t.classList.remove("ptm-select");this.updateAllowedUserEvent()}onResize(){if(this.isDisabled())return;this.updateAfterExternalEvent()}onScroll(){this.measureTypewriterPosition("TypewriterModeOnScroll",(t,i)=>{if(!this.isOnScrollClassSet){let o=l(this.view);if(o)o.classList.add("ptm-scroll"),this.isOnScrollClassSet=!0}if(!t)return;let{activeLineOffset:e,lineOffset:r,lineHeight:n}=t;this.moveCurrentLine(i,e,r,n)})}applyDecorations(){if(!this.tm.settings.isDimUnfocusedEnabled||this.tm.settings.dimUnfocusedMode!=="sentences")return;this.decorations=Ft(this.view,{sentenceDelimiters:".!?",extraCharacters:"*“”‘’",ignoredPatterns:"Mr."})}updateAfterExternalEvent(){if(this.isTableCell()){this.destroyCurrentLine();return}this.loadPerWindowProps(),this.applyDecorations(),this.measureTypewriterPosition("TypewriterModeUpdateAfterExternalEvent",(t,i)=>{if(this.setupScrollListener(),!t)return;if(this.tm.settings.isTypewriterScrollEnabled)this.setPadding(i,t.typewriterOffset);this.recenterAndMoveCurrentLine(i,t)})}moveCurrentLine(t,i,e,r){let n=this.loadCurrentLine(t);if(!n)return;if(n.currentLine.style.height=`${r}px`,n.currentLine.style.top=`${i-e}px`,n.fadeBefore)n.fadeBefore.style.top=`calc(${i-e}px - 100vh)`;if(n.fadeAfter)n.fadeAfter.style.top=`${i-e+r}px`}setPadding(t,i){let e=dt(t);if(!e)return;e.style.padding=this.tm.settings.isOnlyMaintainTypewriterOffsetWhenReachedEnabled?`0 0 ${i}px 0`:`${i}px 0`}resetPadding(t){if(!this.isMarkdownFile())return;let i=dt(t);if(!i)return;i.style.removeProperty("padding")}recenter(t,i){let e=t.state.selection.main.head,r=L.EditorView.scrollIntoView(e,{y:"start",yMargin:i}),n=t.state.update({effects:r});t.dispatch(n)}recenterAndMoveCurrentLine(t,{scrollOffset:i,lineOffset:e,lineHeight:r}){let{isTypewriterScrollEnabled:n,isKeepLinesAboveAndBelowEnabled:o,isHighlightCurrentLineEnabled:m,isFadeLinesEnabled:d}=this.tm.settings;if(n||o)this.recenter(t,i);if(m||d)this.moveCurrentLine(t,i,e,r)}handleCursorStateUpdate(t){if(!this.tm.settings.isRestoreCursorPositionEnabled)return;this.tm.getRestoreCursorPositionFeature().setCursorState(t.state.selection.main)}restoreCursorPosition(t){let i=this.tm.getRestoreCursorPositionFeature();i.saveState();let e=this.tm.plugin.app.workspace.getActiveFile()?.path;if(e){let r=i.state[e];if(r){if(!this.tm.plugin.app.workspace.containerEl.querySelector("span.is-flashing"))t.dispatch({selection:r})}}}}function ct(t){return L.ViewPlugin.define((i)=>{return new It(t,i)},{decorations:(i)=>i.decorations})}var b=require("obsidian");class E extends b.PluginSettingTab{tm;constructor(t,i){super(t,i.plugin);this.tm=i}addHeading(t){return new b.Setting(this.containerEl).setName(t).setHeading()}addText(t){return new b.Setting(this.containerEl).setName(t)}display(){this.containerEl.empty();for(let i of Object.values(this.tm.features.general))i.registerSetting(this);if(this.addHeading("Typewriter"),this.tm.settings.isKeepLinesAboveAndBelowEnabled)this.addText('Not available if "keep lines above and below" is activated');for(let i of Object.values(this.tm.features.typewriter))i.registerSetting(this);if(this.addHeading("Keep lines above and below"),this.tm.settings.isTypewriterScrollEnabled)this.addText("Not available if typewriter scrolling is activated");for(let i of Object.values(this.tm.features.keepAboveAndBelow))i.registerSetting(this);this.addHeading("Highlight current line");for(let i of Object.values(this.tm.features.currentLine))i.registerSetting(this);this.addHeading("Dimming");for(let i of Object.values(this.tm.features.dimming))i.registerSetting(this);this.addHeading("Limit line width");for(let i of Object.values(this.tm.features.maxChar))i.registerSetting(this);this.addHeading("Restore cursor position");for(let i of Object.values(this.tm.features.restoreCursorPosition))i.registerSetting(this);this.addHeading("Writing focus");for(let i of Object.values(this.tm.features.writingFocus))i.registerSetting(this);this.addHeading("Update notice and funding");for(let i of Object.values(this.tm.features.updates))i.registerSetting(this);let t=this.containerEl.createDiv();this.containerEl.appendChild(t),b.MarkdownRenderer.render(this.app,T,t,this.app.vault.getRoot().path,new b.Component)}}class S{tm;constructor(t){this.tm=t}load(){}}function Ti(t){return t.charAt(0).toUpperCase()+t.slice(1)}class ut extends S{load(){for(let t of["up","down"])this.tm.plugin.addCommand({id:`move-typewriter-${t}`,name:`Move typewriter ${t}`,hotkeys:[{modifiers:["Mod"],key:t==="up"?"ArrowUp":"ArrowDown"}],editorCallback:(i,e)=>this.onCommand(i,t)})}onCommand(t,i){t.exec(`go${Ti(i)}`),window.dispatchEvent(new Event("moveByCommand"))}}class yt extends S{}class bt extends yt{registerCommand(){this.tm.plugin.addCommand({id:this.commandKey,name:this.commandTitle,callback:this.onCommand.bind(this)})}load(){this.registerCommand()}}class u extends bt{registerCommand(){this.tm.plugin.addCommand({id:`${this.commandKey}-toggle`,name:`Toggle ${this.commandTitle}`,callback:this.onCommand.bind(this)}),this.tm.plugin.addCommand({id:`${this.commandKey}-enable`,name:`Enable ${this.commandTitle}`,callback:this.onEnable.bind(this)}),this.tm.plugin.addCommand({id:`${this.commandKey}-disable`,name:`Disable ${this.commandTitle}`,callback:this.onDisable.bind(this)})}onCommand(){this.featureToggle?.toggle()}onEnable(){this.featureToggle?.toggle(!0)}onDisable(){this.featureToggle?.toggle(!1)}}class St extends u{commandKey="dimming";commandTitle="dimming";featureToggle=this.tm.features.dimming.isDimUnfocusedEnabled}class ft extends u{commandKey="typewriter-mode-plugin";commandTitle="typewriter mode plugin";featureToggle=this.tm.features.general.isPluginActivated}class Ct extends u{commandKey="typewriter";commandTitle="typewriter scrolling";featureToggle=this.tm.features.typewriter.isTypewriterScrollEnabled}class Tt extends u{featureToggle=null;commandKey="typewriter-scrolling-and-paragraph-dimming";commandTitle="typewriter scrolling and paragraph dimming";onCommand(){let t=this.tm.features.typewriter.isTypewriterScrollEnabled,i=this.tm.features.dimming.isDimUnfocusedEnabled,e=t.getSettingValue()&&i.getSettingValue();t.toggle(!e),i.toggle(!e)}onEnable(){this.tm.features.typewriter.isTypewriterScrollEnabled.toggle(!0),this.tm.features.dimming.isDimUnfocusedEnabled.toggle(!0)}onDisable(){this.tm.features.typewriter.isTypewriterScrollEnabled.toggle(!1),this.tm.features.dimming.isDimUnfocusedEnabled.toggle(!1)}}var xt=require("obsidian"),Lt=require("obsidian");class Mt{tm;constructor(t){this.tm=t}focusModeActive=!1;maximizedClass="ptm-maximized";focusModeClass="ptm-focus-mode";vignetteElClass="ptm-writing-focus-vignette-element";vignetteStyleAttr="data-ptm-writing-focus-vignette-style";leftSplitCollapsed=!1;rightSplitCollapsed=!1;prevWasFullscreen=!1;addVignette(t){let i=this.tm.settings.doesWritingFocusShowHeader?t.containerEl:t.contentEl;i.classList.add(this.vignetteElClass),i.setAttr(this.vignetteStyleAttr,this.tm.settings.writingFocusVignetteStyle)}removeVignette(t){let i=this.tm.settings.doesWritingFocusShowHeader?t.containerEl:t.contentEl;i.removeAttribute(this.vignetteStyleAttr),i.classList.remove(this.vignetteElClass)}startFullscreen(t){if(Lt.Platform.isMobile)return;let i=window.electron.remote.getCurrentWindow();this.prevWasFullscreen=i.isFullScreen(),i.setFullScreen(!0);let e=()=>{this.onExitFullscreenWritingFocus(t),i.off("leave-full-screen",e)};i.on("leave-full-screen",e)}exitFullscreen(){if(Lt.Platform.isMobile)return;if(this.prevWasFullscreen)return;window.electron.remote.getCurrentWindow().setFullScreen(!1)}onExitFullscreenWritingFocus(t){if(this.focusModeActive)this.disableFocusModeForView(t)}storeSplitsValues(){this.leftSplitCollapsed=this.tm.plugin.app.workspace.leftSplit.collapsed,this.rightSplitCollapsed=this.tm.plugin.app.workspace.rightSplit.collapsed}collapseSplits(){this.tm.plugin.app.workspace.leftSplit.collapse(),this.tm.plugin.app.workspace.rightSplit.collapse()}restoreSplits(){if(!this.leftSplitCollapsed)this.tm.plugin.app.workspace.leftSplit.expand();if(!this.rightSplitCollapsed)this.tm.plugin.app.workspace.rightSplit.expand()}removeExtraneousClasses(){if(this.tm.plugin.app.workspace.containerEl.hasClass(this.maximizedClass))this.tm.plugin.app.workspace.containerEl.removeClass(this.maximizedClass);if(document.body.classList.contains(this.focusModeClass))document.body.classList.remove(this.focusModeClass)}enableFocusModeForView(t){if(this.focusModeActive=!0,!document.body.classList.contains(this.focusModeClass))this.storeSplitsValues();if(this.collapseSplits(),this.tm.plugin.app.workspace.containerEl.toggleClass(this.maximizedClass,!this.tm.plugin.app.workspace.containerEl.hasClass(this.maximizedClass)),document.body.classList.toggle(this.focusModeClass,!document.body.classList.contains(this.focusModeClass)),document.body.classList.contains(this.focusModeClass))Array.from(document.querySelectorAll(`.${this.focusModeClass} .workspace-split`)).forEach((i)=>{let e=i;if(e.querySelector(".mod-active"))e.style.display="flex";else e.style.display="none"});if(this.tm.settings.doesWritingFocusShowVignette)this.addVignette(t);if(this.tm.settings.isWritingFocusFullscreen)this.startFullscreen(t)}disableFocusModeForView(t){if(this.removeExtraneousClasses(),document.body.classList.contains(this.focusModeClass))document.body.classList.remove(this.focusModeClass);if(this.restoreSplits(),Array.from(document.querySelectorAll(".workspace-split")).forEach((i)=>{let e=i;e.style.display="flex"}),this.tm.settings.doesWritingFocusShowVignette)this.removeVignette(t);if(this.tm.settings.isWritingFocusFullscreen)this.exitFullscreen();this.focusModeActive=!1}enableFocusMode(){let t=this.tm.plugin.app.workspace.getActiveViewOfType(xt.ItemView);if(!t||t?.getViewType()==="empty")return;this.enableFocusModeForView(t)}disableFocusMode(){let t=this.tm.plugin.app.workspace.getActiveViewOfType(xt.ItemView);if(!t||t?.getViewType()==="empty")return;this.disableFocusModeForView(t)}toggleFocusMode(){this.focusModeActive?this.disableFocusMode():this.enableFocusMode()}}class Et extends u{featureToggle=null;commandKey="writing-focus";commandTitle="writing focus";writingFocus=new Mt(this.tm);onCommand(){this.writingFocus.toggleFocusMode()}onEnable(){this.writingFocus.enableFocusMode()}onDisable(){this.writingFocus.disableFocusMode()}async onload(){this.tm.plugin.addRibbonIcon("enter","Toggle Writing Focus",(t)=>{this.writingFocus.toggleFocusMode()})}}function jt(t){return[ft,Ct,St,Tt,ut,Et].reduce((i,e)=>{let r=new e(t);return i[r.commandKey]=new e(t),i},{})}function xi(t,i){return Object.fromEntries(Object.entries(t).map(([e,r],n)=>[e,i(r,e,n)]))}function Bt(t,i){return xi(i,(e)=>{return e.reduce((r,n)=>{let o=new n(t);return r[o.settingKey]=o,r},{})})}class a extends S{enable(){}disable(){}getBodyClasses(){return[]}getSettingKey(){return this.settingKey}getSettingValue(){return this.tm.settings[this.settingKey]}}var qt=require("obsidian");class f extends a{settingKey;themeMode;constructor(t,i){super(t);this.themeMode=i,this.settingKey=`currentLineHighlightColor-${i}`}registerSetting(t){new qt.Setting(t.containerEl).setName(`Current line highlight color in ${this.themeMode} themes`).setDesc(`The color of the current line highlight in ${this.themeMode} themes`).setClass("typewriter-mode-setting").addText((i)=>i.setValue(this.getSettingValue()).onChange((e)=>{this.changeCurrentLineHighlightColor(e)}))}load(){this.tm.setCSSVariable(`--current-line-highlight-color-${this.themeMode}`,`${this.getSettingValue()}`)}changeCurrentLineHighlightColor(t){this.tm.settings[this.settingKey]=t,this.tm.setCSSVariable(`--current-line-highlight-color-${this.themeMode}`,`${t}`),this.tm.saveSettings().then()}}class w extends f{constructor(t){super(t,"dark")}}class P extends f{constructor(t){super(t,"light")}}var Gt=require("obsidian");class H extends a{settingKey="currentLineHighlightStyle";getBodyClasses(){return["ptm-current-line-highlight-box","ptm-current-line-highlight-underline"]}registerSetting(t){new Gt.Setting(t.containerEl).setName("Current line highlight style").setDesc("The style of the current line highlight").setClass("typewriter-mode-setting").addDropdown((i)=>i.addOption("box","Box").addOption("underline","Underline").setValue(this.tm.settings.currentLineHighlightStyle).onChange((e)=>{this.changeCurrentLineHighlightStyle(e),t.display()}))}load(){super.load(),this.applyClass()}applyClass(){let t=`ptm-current-line-highlight-${this.tm.settings.currentLineHighlightStyle}`;for(let i of this.getBodyClasses())this.tm.perWindowProps.bodyClasses.remove(i);this.tm.perWindowProps.bodyClasses.push(t)}changeCurrentLineHighlightStyle(t){this.tm.settings.currentLineHighlightStyle=t,this.applyClass(),this.tm.saveSettings().then()}}var Yt=require("obsidian");class A extends a{settingKey="currentLineHighlightUnderlineThickness";registerSetting(t){new Yt.Setting(t.containerEl).setName("Current line underline thickness").setDesc("The thickness of the underline that highlights the current line").setClass("typewriter-mode-setting").addSlider((i)=>i.setLimits(1,5,1).setDynamicTooltip().setValue(this.tm.settings.currentLineHighlightUnderlineThickness).onChange((e)=>{this.changeCurrentLineHighlightUnderlineThickness(e)}))}load(){this.tm.setCSSVariable("--current-line-highlight-underline-thickness",`${this.tm.settings.currentLineHighlightUnderlineThickness}px`)}changeCurrentLineHighlightUnderlineThickness(t){this.tm.settings.currentLineHighlightUnderlineThickness=t,this.tm.setCSSVariable("--current-line-highlight-underline-thickness",`${t}px`),this.tm.saveSettings()}}var _t=require("obsidian");class s extends a{toggleClass=null;isToggleClassPersistent=!1;getBodyClasses(){if(this.toggleClass)return[this.toggleClass];return[]}isSettingEnabled(){return!0}getToggleClass(){return this.toggleClass}registerSetting(t){new _t.Setting(t.containerEl).setName(this.settingTitle).setDesc(this.settingDesc).setClass("typewriter-mode-setting").addToggle((i)=>i.setValue(this.getSettingValue()).onChange((e)=>{this.toggle(e),t.display()})).setDisabled(!this.isSettingEnabled())}load(){this.tm.settings[this.settingKey]?this.enable():this.disable()}toggle(t=null){let i=t;if(i===null)i=!this.getSettingValue();this.tm.settings={...this.tm.settings,[this.settingKey]:i},i?this.enable():this.disable(),this.tm.saveSettings().then()}enable(){if(this.toggleClass){let t=this.isToggleClassPersistent?"persistentBodyClasses":"bodyClasses";if(!this.tm.perWindowProps[t].contains(this.toggleClass))this.tm.perWindowProps[t].push(this.toggleClass)}}disable(){if(this.toggleClass){let t=this.isToggleClassPersistent?"persistentBodyClasses":"bodyClasses";this.tm.perWindowProps[t].remove(this.toggleClass)}}}class U extends s{settingKey="isFadeLinesEnabled";toggleClass="ptm-fade-lines";settingTitle="Fade lines";settingDesc="This places a gradient on the lines above and below the current line, making the text fade out more and more towards the top and bottom of the editor."}var Jt=require("obsidian");class k extends a{settingKey="fadeLinesIntensity";registerSetting(t){new Jt.Setting(t.containerEl).setName("Intensity of the fade lines gradient").setDesc("How soon lines shall be faded out").setClass("typewriter-mode-setting").addSlider((i)=>i.setLimits(0,100,5).setDynamicTooltip().setValue(this.tm.settings.fadeLinesIntensity*100).onChange((e)=>{this.changeFadeLinesIntensity(e/100)}))}load(){this.tm.setCSSVariable("--ptm-fade-lines-intensity",`${this.tm.settings.fadeLinesIntensity*100}%`)}changeFadeLinesIntensity(t=0.5){this.tm.settings.fadeLinesIntensity=t,this.tm.setCSSVariable("--ptm-fade-lines-intensity",`${t*100}%`),this.tm.saveSettings()}}class K extends s{settingKey="isHighlightCurrentLineEnabled";toggleClass="ptm-highlight-current-line";settingTitle="Highlight current line";settingDesc="Highlights the line that the cursor is currently on"}class $ extends s{settingKey="isHighlightCurrentLineOnlyInFocusedEditorEnabled";toggleClass="ptm-highlight-current-line-only-in-active-editor";hasCommand=!1;settingTitle="Highlight current line only in focused note";settingDesc="Only show highlighted line in the note your cursor is on (e.g. if you have multiple notes open in split panes)"}var Qt=[K,U,k,P,w,H,A,$];class v extends s{settingKey="isDimHighlightListParentEnabled";toggleClass="ptm-dim-highlight-list-parent";settingTitle="Highlight list parents";settingDesc="If this is enabled, the parent items of the active list item are not dimmed"}class O extends s{settingKey="isDimTableAsOneEnabled";toggleClass="ptm-dim-table-as-one";settingTitle="Undim all table cells when editing";settingDesc="If this is enabled, all table cells are shown/not dimmed when you edit a table. If this is disabled, only the current table cell that you are editing is shown, while the other cells remain dimmed."}class F extends s{settingKey="isDimUnfocusedEnabled";toggleClass="ptm-dim-unfocused";settingTitle="Dim unfocused";settingDesc="Dim unfocused paragraphs / sentences"}var Xt=require("obsidian");class V extends a{settingKey="dimUnfocusedEditorsBehavior";registerSetting(t){new Xt.Setting(t.containerEl).setName("Dimming behavior in unfocused notes").setDesc("How to dim paragraphs / sentences in notes / editors that your cursor is not on (e.g. if you have multiple notes open in split panes)").setClass("typewriter-mode-setting").addDropdown((i)=>i.addOption("dim-none","Do not dim anything").addOption("dim","Dim all but the previously focused paragraph / sentence").addOption("dim-all","Dim everything").setValue(this.tm.settings.dimUnfocusedEditorsBehavior).onChange((e)=>{this.changeDimUnfocusedEditorsBehavior(e),t.display()}))}load(){super.load(),this.tm.perWindowProps.bodyAttrs["data-ptm-dim-unfocused-editors-behavior"]=this.tm.settings.dimUnfocusedEditorsBehavior}changeDimUnfocusedEditorsBehavior(t){this.tm.settings.dimUnfocusedEditorsBehavior=t,this.tm.perWindowProps.bodyAttrs["data-ptm-dim-unfocused-editors-behavior"]=t,this.tm.saveSettings().then()}}var Zt=require("obsidian");class W extends a{settingKey="dimUnfocusedMode";registerSetting(t){new Zt.Setting(t.containerEl).setName("Dim unfocused mode").setDesc("Choose to dim unfocused paragraphs or sentences").setClass("typewriter-mode-setting").addDropdown((i)=>i.addOption("paragraphs","Paragraphs").addOption("sentences","Sentences").setValue(this.tm.settings.dimUnfocusedMode).onChange((e)=>{this.change(e),t.display()}))}load(){super.load(),this.tm.perWindowProps.bodyAttrs["data-ptm-dim-unfocused-mode"]=this.tm.settings.dimUnfocusedMode}change(t){this.tm.settings.dimUnfocusedMode=t,this.tm.perWindowProps.bodyAttrs["data-ptm-dim-unfocused-mode"]=this.tm.settings.dimUnfocusedMode,this.tm.saveSettings().then()}}var Rt=require("obsidian");class I extends a{settingKey="dimmedOpacity";registerSetting(t){new Rt.Setting(t.containerEl).setName("Opacity of dimmed elements").setDesc("The opacity of dimmed elements").setClass("typewriter-mode-setting").addSlider((i)=>i.setLimits(0,100,5).setDynamicTooltip().setValue(this.tm.settings.dimmedOpacity*100).onChange((e)=>{this.changeDimmedOpacity(e/100)}))}load(){this.tm.setCSSVariable("--dimmed-opacity",`${this.tm.settings.dimmedOpacity}`)}changeDimmedOpacity(t=0.25){this.tm.settings.dimmedOpacity=t,this.tm.setCSSVariable("--dimmed-opacity",`${t}`),this.tm.saveSettings()}}class j extends s{settingKey="isPauseDimUnfocusedWhileScrollingEnabled";toggleClass="ptm-dim-unfocused-pause-while-scrolling";settingTitle="Pause dimming while scrolling";settingDesc="If this is enabled, paragraphs / sentences are not dimmed while scrolling"}class B extends s{settingKey="isPauseDimUnfocusedWhileSelectingEnabled";toggleClass="ptm-dim-unfocused-pause-while-selecting";settingTitle="Pause dimming while selecting text";settingDesc="If this is enabled, paragraphs / sentences are not dimmed while selecting text"}var zt=[F,W,v,O,I,j,B,V];class q extends s{settingKey="isOnlyActivateAfterFirstInteractionEnabled";settingTitle="Only activate after first interaction";settingDesc="Activate the focused line highlight and paragraph dimming only after the first interaction with the editor"}class G extends s{settingKey="isPluginActivated";toggleClass="ptm-plugin-activated";settingTitle="Activate Typewriter Mode";settingDesc="This enables or disables all the features below."}var Dt=[G,q];class Y extends s{settingKey="isKeepLinesAboveAndBelowEnabled";settingTitle="Keep lines above and below";settingDesc="When enabled, always keeps the specified amount of lines above and below the current line in view";isSettingEnabled(){return!this.tm.settings.isTypewriterScrollEnabled}}var Nt=require("obsidian");class _ extends a{settingKey="linesAboveAndBelow";registerSetting(t){new Nt.Setting(t.containerEl).setName("Amount of lines above and below the current line").setDesc("The amount of lines to always keep above and below the current line").setClass("typewriter-mode-setting").addText((i)=>i.setValue(this.tm.settings.linesAboveAndBelow.toString()).onChange((e)=>{this.changeAmountOfLinesAboveAndBelow(Number.parseInt(e))}))}changeAmountOfLinesAboveAndBelow(t){this.tm.settings.linesAboveAndBelow=t,this.tm.saveSettings().then()}}var ti=[Y,_];class J extends s{settingKey="isMaxCharsPerLineEnabled";toggleClass="ptm-max-chars-per-line";isToggleClassPersistent=!0;settingTitle="Limit maximum number of characters per line";settingDesc="Limits the maximum number of characters per line"}var ii=require("obsidian");class Q extends a{settingKey="maxCharsPerLine";registerSetting(t){new ii.Setting(t.containerEl).setName("Maximum number of characters per line").setDesc("The maximum number of characters per line").setClass("typewriter-mode-setting").addText((i)=>i.setValue(this.tm.settings.maxCharsPerLine.toString()).onChange((e)=>{this.changeMaxCharsPerLine(Number.parseInt(e))}))}load(){this.tm.setCSSVariable("--max-chars-per-line",`${this.tm.settings.maxCharsPerLine}ch`)}changeMaxCharsPerLine(t){this.tm.settings.maxCharsPerLine=t,this.tm.setCSSVariable("--max-chars-per-line",`${t}ch`),this.tm.saveSettings()}}var ei=[J,Q];class X extends s{settingKey="isRestoreCursorPositionEnabled";settingTitle="Restore cursor position";settingDesc="Restore the last cursor position when opening files";stateFilePath=`${this.tm.plugin.manifest.dir}/cursor-positions.json`;state={};enable(){super.enable(),this.loadState(),this.tm.plugin.registerEvent(this.tm.plugin.app.workspace.on("quit",this.saveState)),this.tm.plugin.registerEvent(this.tm.plugin.app.vault.on("rename",this.onRenameFile)),this.tm.plugin.registerEvent(this.tm.plugin.app.vault.on("delete",this.onDeleteFile))}disable(){this.saveState(),this.tm.plugin.app.workspace.off("quit",this.saveState),this.tm.plugin.app.workspace.off("rename",this.onRenameFile),this.tm.plugin.app.workspace.off("delete",this.onDeleteFile)}async loadState(){if(await this.tm.plugin.app.vault.adapter.exists(this.stateFilePath)){let t=await this.tm.plugin.app.vault.adapter.read(this.stateFilePath);this.state=JSON.parse(t)}}async saveState(){await this.tm.plugin.app.vault.adapter.write(this.stateFilePath,JSON.stringify(this.state))}onRenameFile(t,i){let e=t.path,r=i;this.state[e]=this.state[r],delete this.state[r]}onDeleteFile(t){let i=t.path;delete this.state[i]}async setCursorState(t){let i=this.tm.plugin.app.workspace.getActiveFile()?.path;if(!i)return;this.state[i]=t}}var ri=[X];class Z extends s{settingKey="isOnlyMaintainTypewriterOffsetWhenReachedEnabled";hasCommand=!1;settingTitle="Only maintain typewriter offset when reached";settingDesc="The line that the cursor is on will not be scrolled to the center of the editor until it the specified typewriter offset is reached. This removes the additional space at the top of the editor."}var ni=require("obsidian");class R extends a{settingKey="typewriterOffset";registerSetting(t){new ni.Setting(t.containerEl).setName("Typewriter offset").setDesc("Positions the typewriter line at the specified percentage of the screen").setClass("typewriter-mode-setting").addSlider((i)=>i.setLimits(0,100,5).setDynamicTooltip().setValue(this.tm.settings.typewriterOffset*100).onChange((e)=>{this.changeTypewriterOffset(e/100)}))}changeTypewriterOffset(t){this.tm.settings.typewriterOffset=t,this.tm.saveSettings().then()}}class z extends s{settingKey="isTypewriterOnlyUseCommandsEnabled";toggleClass="ptm-typewriter-only-use-commands";settingTitle="Do not snap typewriter with arrow keys";settingDesc="The typewriter will only snap when using this plugin's move commands. It will not snap when using the arrow keys. The move commands are by default Cmd/Ctrl+ArrowUp/ArrowDown, but you can assign your own hotkeys for the move commands in Obsidian's settings."}class D extends s{settingKey="isTypewriterScrollEnabled";toggleClass="ptm-typewriter-scroll";settingTitle="Typewriter scrolling";settingDesc="Turns typewriter scrolling on or off";isSettingEnabled(){return!this.tm.settings.isKeepLinesAboveAndBelowEnabled}}var oi=[D,R,Z,z];class N extends s{settingKey="isAnnounceUpdatesEnabled";toggleClass="ptm-announce-updates";settingTitle="Announce updates";settingDesc="If enabled you will get a notice with release notes whenever you install a new version of Typewriter Mode"}var si=[N];class tt extends s{settingKey="isWritingFocusFullscreen";settingTitle="Make Obsidian fullscreen in writing focus";settingDesc="If enabled, the Obsidian window will toggle to fullscreen when entering writing focus"}class it extends s{settingKey="doesWritingFocusShowHeader";toggleClass="ptm-writing-focus-shows-header";settingTitle="Show header in writing focus";settingDesc="If enabled, the header will be shown in writing focus"}class et extends s{settingKey="doesWritingFocusShowStatusBar";toggleClass="ptm-writing-focus-shows-status-bar";settingTitle="Show status bar in writing focus";settingDesc="If enabled, the status bar will be shown in writing focus"}class rt extends s{settingKey="doesWritingFocusShowVignette";settingTitle="Writing focus vignette";settingDesc="Add a vignette to the edges of the screen in writing focus"}var mi=require("obsidian");class nt extends a{settingKey="writingFocusVignetteStyle";registerSetting(t){new mi.Setting(t.containerEl).setName("Writing focus vignette style").setDesc("The style of the vignette in writing focus mode").setClass("typewriter-mode-setting").addDropdown((i)=>i.addOption("box","Box").addOption("column","Column").setValue(this.tm.settings.writingFocusVignetteStyle).onChange((e)=>{this.changeVignetteStyle(e),t.display()}))}changeVignetteStyle(t){this.tm.settings.writingFocusVignetteStyle=t,this.tm.saveSettings().then()}}var di=[it,et,tt,rt,nt];function ai(t){return Bt(t,{currentLine:Qt,dimming:zt,general:Dt,keepAboveAndBelow:ti,maxChar:ei,typewriter:oi,updates:si,writingFocus:di,restoreCursorPosition:ri})}var wt={version:null,isAnnounceUpdatesEnabled:!0,isPluginActivated:!0,isTypewriterScrollEnabled:!0,isOnlyActivateAfterFirstInteractionEnabled:!1,isOnlyMaintainTypewriterOffsetWhenReachedEnabled:!1,isTypewriterOnlyUseCommandsEnabled:!1,typewriterOffset:0.5,isKeepLinesAboveAndBelowEnabled:!1,linesAboveAndBelow:5,isMaxCharsPerLineEnabled:!1,maxCharsPerLine:64,isDimUnfocusedEnabled:!1,isDimHighlightListParentEnabled:!1,isDimTableAsOneEnabled:!0,dimUnfocusedMode:"paragraphs",dimUnfocusedEditorsBehavior:"dim",dimmedOpacity:0.25,isPauseDimUnfocusedWhileScrollingEnabled:!0,isPauseDimUnfocusedWhileSelectingEnabled:!0,isHighlightCurrentLineEnabled:!1,isFadeLinesEnabled:!1,fadeLinesIntensity:0.5,isHighlightCurrentLineOnlyInFocusedEditorEnabled:!1,currentLineHighlightStyle:"box",currentLineHighlightUnderlineThickness:1,"currentLineHighlightColor-dark":"#444","currentLineHighlightColor-light":"#ddd",doesWritingFocusShowHeader:!1,doesWritingFocusShowStatusBar:!1,doesWritingFocusShowVignette:!0,isWritingFocusFullscreen:!0,writingFocusVignetteStyle:"box",isRestoreCursorPositionEnabled:!1};class ot{plugin;loadData;saveData;settings=wt;perWindowProps={cssVariables:{},bodyClasses:[],bodyAttrs:{},allBodyClasses:[],persistentBodyClasses:[]};editorExtensions;features;commands;constructor(t,i,e){this.plugin=t,this.loadData=i,this.saveData=e,this.features=ai(this),this.commands=jt(this),this.editorExtensions=[ct(this),[]]}async load(){await this.loadSettings(),await this.saveSettings(),this.loadPerWindowProps(),this.loadEditorExtension()}loadPerWindowProps(){let t=[];for(let i of Object.values(this.features))for(let e of Object.values(i))e.load(),t=t.concat(e.getBodyClasses());this.perWindowProps.allBodyClasses=t;for(let i of Object.values(this.commands))i.load()}getRestoreCursorPositionFeature(){return this.features.restoreCursorPosition.isRestoreCursorPositionEnabled}loadEditorExtension(){this.plugin.registerEditorExtension(this.editorExtensions)}loadSettingsTab(){this.plugin.addSettingTab(new E(this.plugin.app,this))}unload(){for(let t of Object.values(this.features))for(let i of Object.values(t))i.disable()}async loadSettings(){let t=await this.loadData();this.settings=Object.assign(wt,t)}async saveSettings(){await this.saveData(this.settings),this.plugin.app.workspace.updateOptions()}setCSSVariable(t,i){this.perWindowProps.cssVariables[t]=i}}class Pt extends hi.Plugin{tm;constructor(t,i){super(t,i);this.tm=new ot(this,async()=>await this.loadData(),async(e)=>await this.saveData(e))}async onload(){await this.tm.load(),this.tm.loadSettingsTab(),this.app.workspace.onLayoutReady(()=>{this.announceUpdate()})}onunload(){this.tm.unload()}announceUpdate(){let t=this.manifest.version,i=this.tm.settings.version;if(!i)return;if(t===i)return;if(this.tm.settings.version=t,this.tm.saveSettings().then(),this.tm.settings.isAnnounceUpdatesEnabled===!1)return;new mt(this.app,t,i).open()}}

  
  return module.exports.default || module.exports;
})();

// =========================================================================
// SUB-PLUGIN 2: Folder Dashboard (IIFE Wrapped)
// =========================================================================
const FolderDashboardPluginClass = (function() {
  const exports = {};
  const module = { exports };
  
  const { Plugin, ItemView, TFolder, TFile, setIcon, MarkdownView, Modal, Notice } = require('obsidian');

const VIEW_TYPE = "folder-dashboard-view";

class CreateItemModal extends Modal {
  constructor(app, currentPath, plugin, onViewRefresh) {
    super(app);
    this.currentPath = currentPath;
    this.plugin = plugin;
    this.onViewRefresh = onViewRefresh;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    
    contentEl.addClass("dashboard-create-modal");

    contentEl.createEl("h2", { text: "Create New Item", cls: "modal-title" });

    const formEl = contentEl.createEl("div", { cls: "modal-form" });

    // Type Selector (File or Folder)
    const typeGroup = formEl.createEl("div", { cls: "modal-form-group" });
    typeGroup.createEl("label", { text: "Type", cls: "modal-label" });
    const typeSelect = typeGroup.createEl("select", { cls: "modal-select" });
    typeSelect.createEl("option", { text: "Note (.md)", value: "file" });
    typeSelect.createEl("option", { text: "Folder", value: "folder" });

    // Name Input
    const nameGroup = formEl.createEl("div", { cls: "modal-form-group" });
    nameGroup.createEl("label", { text: "Name", cls: "modal-label" });
    const nameInput = nameGroup.createEl("input", {
      type: "text",
      placeholder: "Enter name...",
      cls: "modal-input"
    });

    // Button Row
    const buttonRow = formEl.createEl("div", { cls: "modal-buttons" });
    const cancelBtn = buttonRow.createEl("button", { text: "Cancel", cls: "modal-btn btn-cancel" });
    const createBtn = buttonRow.createEl("button", { text: "Create", cls: "modal-btn btn-create" });

    // Focus input on load
    setTimeout(() => nameInput.focus(), 50);

    const submit = async () => {
      const name = nameInput.value.trim();
      if (!name) {
        new Notice("Please enter a name");
        return;
      }
      const type = typeSelect.value;
      let filename = name;
      if (type === "file" && !filename.endsWith(".md")) {
        filename += ".md";
      }
      
      const parentPath = this.currentPath;
      const targetPath = parentPath ? `${parentPath}/${filename}` : filename;

      // Check if already exists
      const existing = this.app.vault.getAbstractFileByPath(targetPath);
      if (existing) {
        new Notice("A file or folder with this name already exists");
        return;
      }

      try {
        if (type === "folder") {
          await this.app.vault.createFolder(targetPath);
          new Notice(`Folder "${name}" created successfully`);
        } else {
          await this.app.vault.create(targetPath, "");
          new Notice(`Note "${name}" created successfully`);
        }
        this.onViewRefresh();
        this.close();
      } catch (err) {
        new Notice(`Error creating item: ${err.message}`);
      }
    };

    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      } else if (e.key === "Escape") {
        this.close();
      }
    });

    createBtn.addEventListener("click", () => submit());
    cancelBtn.addEventListener("click", () => this.close());
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
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
    this.panOffset = { x: 0, y: 0 };
    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.draggedItem = null;
    this.draggedElement = null;
    this.dragStartMouse = { x: 0, y: 0 };
    this.dragStartPos = { x: 0, y: 0 };
    this.hasMoved = false;
  }
  getViewType() {
    return VIEW_TYPE;
  }
  getDisplayText() {
    return "Dashboard";
  }
  getIcon() {
    return "folder";
  }
  async onOpen() {
    const container = this.containerEl.children[1];
    container.empty();
    container.addClass("obsidian-folder-dashboard-container");
    container.tabIndex = 0;

    const headerEl = container.createEl("div", { cls: "dashboard-header" });
    this.breadcrumbsEl = headerEl.createEl("div", { cls: "dashboard-breadcrumbs" });

    this.sectionsContainerEl = container.createEl("div", { cls: "dashboard-content-scroll" });

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

    container.addEventListener("dblclick", (e) => {
      if (
        e.target.closest(".dashboard-card") ||
        e.target.closest(".dashboard-list-row") ||
        e.target.closest("button") ||
        e.target.closest("input") ||
        e.target.closest(".dashboard-breadcrumbs") ||
        e.target.closest(".dashboard-hud-controls")
      ) {
        return;
      }
      e.stopPropagation();
      new CreateItemModal(this.app, this.currentPath, this.plugin, () => this.render()).open();
    });

    this.searchInput.addEventListener("blur", () => {
      setTimeout(() => {
        if (document.activeElement === document.body || container.contains(document.activeElement)) {
          this.searchInput.focus();
        }
      }, 50);
    });

    // Register Board pan & zoom listeners once (only active in "board" mode)
    this.sectionsContainerEl.addEventListener("pointerdown", (e) => {
      if (this.getViewMode() !== "board") return;
      if (e.target !== this.sectionsContainerEl && !e.target.classList.contains("dashboard-board-canvas")) return;
      this.isPanning = true;
      this.sectionsContainerEl.setPointerCapture(e.pointerId);
      this.panStart = {
        x: e.clientX - this.panOffset.x,
        y: e.clientY - this.panOffset.y
      };
    });

    this.sectionsContainerEl.addEventListener("pointermove", (e) => {
      if (this.getViewMode() !== "board") return;
      if (!this.isPanning) return;
      const dx = e.clientX - this.panStart.x;
      const dy = e.clientY - this.panStart.y;
      this.panOffset = { x: dx, y: dy };
      this.updateZoomAndPanStyles();
    });

    this.sectionsContainerEl.addEventListener("pointerup", (e) => {
      if (this.getViewMode() !== "board") return;
      if (!this.isPanning) return;
      this.isPanning = false;
      this.sectionsContainerEl.releasePointerCapture(e.pointerId);
    });

    this.sectionsContainerEl.addEventListener("wheel", (e) => {
      if (this.getViewMode() !== "board") return;
      // Prevent default page scroll and native Ctrl+Wheel window zooming
      e.preventDefault();
      e.stopPropagation();

      const rect = this.sectionsContainerEl.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const boardX = (mouseX - this.panOffset.x) / this.zoom;
      const boardY = (mouseY - this.panOffset.y) / this.zoom;
      
      let dx = e.deltaX;
      let dy = e.deltaY;
      if (e.deltaMode === 1) {
        dx *= 40;
        dy *= 40;
      } else if (e.deltaMode === 2) {
        dx *= 800;
        dy *= 800;
      }

      if (e.ctrlKey) {
        const zoomIntensity = 0.0015;
        let newZoom = this.zoom * Math.exp(-dy * zoomIntensity);
        newZoom = Math.min(Math.max(0.25, newZoom), 2.5);
        
        const newPanX = mouseX - boardX * newZoom;
        const newPanY = mouseY - boardY * newZoom;
        
        this.zoom = newZoom;
        this.panOffset = { x: newPanX, y: newPanY };
      } else {
        if (e.shiftKey) {
          this.panOffset.x -= dy;
          this.panOffset.y -= dx;
        } else {
          this.panOffset.x -= dx;
          this.panOffset.y -= dy;
        }
      }
      
      this.updateZoomAndPanStyles();
    }, { passive: false });

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
    this.panOffset = { x: 0, y: 0 };
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
    const switcherEl = hudEl.createEl("div", { cls: "dashboard-view-switcher" });
    const currentMode = this.getViewMode();
    const modes = ["dashboard", "list", "board"];
    modes.forEach(mode => {
      const btn = switcherEl.createEl("button", {
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
    this.panOffset = { x: 0, y: 0 };
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
    this.renderItems();
  }
  render() {
    this.renderBreadcrumbs();
    this.renderViewSwitcherHUD(this.containerEl.children[1]);
    this.renderItems();
  }
  renderBreadcrumbs() {
    this.breadcrumbsEl.empty();
    const rootPart = this.breadcrumbsEl.createEl("span", {
      text: "Vault",
      cls: "breadcrumb-item"
    });
    rootPart.addEventListener("click", (e) => {
      e.stopPropagation();
      this.navigateToPath("");
    });
    if (this.currentPath !== "") {
      const parts = this.currentPath.split("/");
      let currentAccumulated = "";
      parts.forEach((part) => {
        currentAccumulated = currentAccumulated ? `${currentAccumulated}/${part}` : part;
        const targetPath = currentAccumulated;
        const divider = this.breadcrumbsEl.createEl("span", { cls: "breadcrumb-divider" });
        setIcon(divider, "chevron-right");
        const pathPart = this.breadcrumbsEl.createEl("span", {
          text: part,
          cls: "breadcrumb-item"
        });
        pathPart.addEventListener("click", (e) => {
          e.stopPropagation();
          this.navigateToPath(targetPath);
        });
      });
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
      if (this.hasMoved) {
        return; // Don't trigger navigation if it was dragged
      }
      if (isFolder) {
        this.navigateToPath(item.path);
      } else {
        this.openFile(item);
      }
    });

    return card;
  }
  renderItems() {
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
            }
            
            this.draggedItem = null;
            this.draggedElement = null;
          });
        });
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
  handleKeyDown(e) {
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
        this.updateFileBreadcrumbs(leaf);
      })
    );

    this.registerEvent(
      this.app.workspace.on("file-open", (file) => {
        const leaf = this.app.workspace.getActiveViewOfType(MarkdownView)?.leaf;
        this.updateFileBreadcrumbs(leaf);
      })
    );

    // Initial load breadcrumbs for active view if ready
    this.app.workspace.onLayoutReady(() => {
      const activeLeaf = this.app.workspace.getActiveViewOfType(MarkdownView)?.leaf;
      if (activeLeaf) {
        this.updateFileBreadcrumbs(activeLeaf);
      }
    });

    this.registerEvent(
      this.app.vault.on("create", (file) => {
        this.refreshActiveViews();
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        this.refreshActiveViews();
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        this.refreshActiveViews();
      })
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  refreshActiveViews() {
    this.app.workspace.getLeavesOfType(VIEW_TYPE).forEach((leaf) => {
      if (leaf.view instanceof FolderDashboardView) {
        leaf.view.render();
      }
    });
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

  updateFileBreadcrumbs(leaf) {
    if (!leaf || !leaf.view || typeof leaf.view.getViewType !== "function" || leaf.view.getViewType() !== "markdown") {
      return;
    }
    
    const view = leaf.view;
    const file = view.file;
    if (!file) return;

    let breadcrumbContainer = view.contentEl.querySelector(".inferno-file-breadcrumb");
    if (!breadcrumbContainer) {
      breadcrumbContainer = document.createElement("div");
      breadcrumbContainer.className = "inferno-file-breadcrumb";
      view.contentEl.insertBefore(breadcrumbContainer, view.contentEl.firstChild);
    }

    breadcrumbContainer.empty();
    
    const rootLink = breadcrumbContainer.createEl("span", {
      text: "Vault",
      cls: "breadcrumb-item"
    });
    rootLink.addEventListener("click", () => {
      this.activateViewAndNavigate("");
    });

    const parts = file.path.split("/");
    const noteName = parts.pop();
    
    let currentPath = "";
    parts.forEach((part) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const targetPath = currentPath;
      
      const divider = breadcrumbContainer.createEl("span", { cls: "breadcrumb-divider" });
      setIcon(divider, "chevron-right");
      
      const folderLink = breadcrumbContainer.createEl("span", {
        text: part,
        cls: "breadcrumb-item"
      });
      folderLink.addEventListener("click", () => {
        this.activateViewAndNavigate(targetPath);
      });
    });

    const divider = breadcrumbContainer.createEl("span", { cls: "breadcrumb-divider" });
    setIcon(divider, "chevron-right");
    breadcrumbContainer.createEl("span", {
      text: file.basename,
      cls: "breadcrumb-item is-active"
    });
  }
}

module.exports = FolderDashboardPlugin;

  
  return module.exports.default || module.exports;
})();

// =========================================================================
// NEXT WORD PREDICTION SYSTEM
// =========================================================================
const { Decoration, ViewPlugin, WidgetType, keymap, EditorView } = require('@codemirror/view');
const { requestUrl } = require('obsidian');

class GhostTextWidget extends WidgetType {
  constructor(text) {
    super();
    this.text = text;
  }
  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-ghost-text";
    span.textContent = this.text;
    span.style.color = "var(--text-faint)";
    span.style.opacity = "0.5";
    span.style.fontStyle = "italic";
    span.style.pointerEvents = "none";
    return span;
  }
}

class CorrectionWidget extends WidgetType {
  constructor(replacement) {
    super();
    this.replacement = replacement;
  }
  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-correction-text";
    span.textContent = this.replacement;
    span.style.color = "var(--text-accent)";
    span.style.opacity = "0.8";
    span.style.fontStyle = "italic";
    span.style.textDecoration = "underline dashed";
    span.style.pointerEvents = "none";
    return span;
  }
}

class PredictionEngine {
  constructor(app) {
    this.app = app;
    this.transitions = {}; // bigram transition counts
    this.trigrams = {};    // trigram transition counts
    this.wordFreq = {};    // single word frequencies
    this.vocabulary = new Set();
    this.commonWords = [
      'the', 'and', 'to', 'of', 'a', 'in', 'is', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 
      'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 
      'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'use', 'an', 'each', 'which', 'she', 
      'do', 'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 
      'some', 'her', 'would', 'make', 'like', 'him', 'into', 'time', 'has', 'look', 'two', 'more', 'write', 
      'go', 'see', 'number', 'no', 'way', 'could', 'people', 'my', 'than', 'first', 'water', 'been', 'call', 
      'who', 'oil', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part', 
      'here', 'new', 'work', 'place', 'take', 'years', 'live', 'back', 'give', 'most', 'very', 'after', 
      'things', 'our', 'just', 'name', 'good', 'sentence', 'man', 'think', 'say', 'great', 'where', 'help', 
      'through', 'much', 'before', 'line', 'right', 'too', 'mean', 'old', 'any', 'same', 'tell', 'boy', 
      'follow', 'came', 'want', 'show', 'also', 'around', 'form', 'three', 'small', 'another', 'large', 
      'even', 'because', 'must', 'big', 'such', 'different', 'home', 'us', 'move', 'try', 'kind', 'hand', 
      'picture', 'again', 'change', 'off', 'play', 'spell', 'air', 'away', 'animal', 'house', 'point', 
      'page', 'letter', 'mother', 'answer', 'found', 'study', 'still', 'learn', 'should', 'world'
    ];
    this.loadSeedData();
  }

  loadSeedData() {
    const seeds = {
      "what": { "is": 10, "are": 5, "do": 5, "can": 3 },
      "how": { "to": 20, "do": 5, "can": 5, "is": 3 },
      "this": { "is": 25, "will": 5, "was": 5, "can": 3 },
      "in": { "the": 30, "order": 10, "front": 8, "addition": 5 },
      "would": { "like": 15, "be": 10, "have": 5 },
      "want": { "to": 25 },
      "one": { "of": 20 },
      "need": { "to": 25 },
      "going": { "to": 25 },
      "will": { "be": 20, "have": 10, "not": 5 },
      "there": { "are": 15, "is": 15, "will": 5 },
      "we": { "can": 15, "will": 10, "need": 5, "are": 5 },
      "you": { "can": 15, "will": 10, "need": 5, "are": 5 },
      "as": { "well": 15, "soon": 10, "long": 10 },
      "due": { "to": 15 },
      "order": { "to": 20 },
      "so": { "that": 15 },
      "front": { "of": 15 },
      "next": { "to": 15, "step": 10, "word": 10, "page": 5 },
      "associated": { "with": 15 },
      "related": { "to": 15 },
      "similar": { "to": 15 },
      "once": { "upon": 15 },
      "upon": { "a": 15 },
      "refer": { "to": 15 },
      "referred": { "as": 10, "to": 10 },
      "unable": { "to": 15 },
      "according": { "to": 15 },
      "based": { "on": 15 },
      "focus": { "on": 10 },
      "interested": { "in": 10 },
      "depend": { "on": 10 },
      "depends": { "on": 10 },
      "consists": { "of": 10 }
    };

    const trigramSeeds = {
      "once upon": { "a": 15 },
      "upon a": { "time": 15 },
      "in order": { "to": 20 },
      "as well": { "as": 15 },
      "so that": { "we": 10, "you": 10, "they": 5 },
      "referred to": { "as": 15 },
      "referred as": { "a": 10, "the": 10 },
      "in front": { "of": 15 },
      "next to": { "the": 10, "a": 10 },
      "what is": { "the": 10, "your": 5, "a": 5 },
      "how to": { "use": 10, "make": 10, "do": 10, "get": 5 },
      "this is": { "a": 15, "the": 10, "not": 5, "my": 5 },
      "would like": { "to": 15 }
    };

    for (const w1 in seeds) {
      this.transitions[w1] = Object.assign({}, seeds[w1]);
      for (const w2 in seeds[w1]) {
        this.vocabulary.add(w1);
        this.vocabulary.add(w2);
      }
    }

    for (const key in trigramSeeds) {
      this.trigrams[key] = Object.assign({}, trigramSeeds[key]);
      const parts = key.split(" ");
      this.vocabulary.add(parts[0]);
      this.vocabulary.add(parts[1]);
      for (const w3 in trigramSeeds[key]) {
        this.vocabulary.add(w3);
      }
    }
  }

  async buildModelFromActiveFile() {
    const activeFile = this.app.workspace.getActiveFile();
    if (!activeFile) return;

    try {
      const content = await this.app.vault.read(activeFile);
      this.buildModel(content);
    } catch (e) {
      console.warn("Failed to build prediction model:", e);
    }
  }

  buildModel(content) {
    this.transitions = {};
    this.trigrams = {};
    this.wordFreq = {};
    this.vocabulary.clear();

    this.loadSeedData();

    const rawWords = content.toLowerCase().split(/[^a-zA-Z0-9'-]+/).filter(w => w.length > 0);
    
    for (let i = 0; i < rawWords.length; i++) {
      const w = rawWords[i];
      this.wordFreq[w] = (this.wordFreq[w] || 0) + 1;
      this.vocabulary.add(w);

      if (i < rawWords.length - 1) {
        const nextW = rawWords[i + 1];
        if (!this.transitions[w]) this.transitions[w] = {};
        this.transitions[w][nextW] = (this.transitions[w][nextW] || 0) + 1;
      }

      if (i < rawWords.length - 2) {
        const w1 = rawWords[i];
        const w2 = rawWords[i + 1];
        const w3 = rawWords[i + 2];
        const key = `${w1} ${w2}`;
        if (!this.trigrams[key]) this.trigrams[key] = {};
        this.trigrams[key][w3] = (this.trigrams[key][w3] || 0) + 1;
      }
    }
  }

  predictSingleWord(w1, w2, prefix) {
    // 1. Try Trigram Prediction: w1 w2 -> nextWord matching prefix
    if (w1 && w2) {
      const key = `${w1} ${w2}`;
      if (this.trigrams[key]) {
        const candidates = this.trigrams[key];
        let bestWord = null;
        let maxCount = -1;
        for (const candidate in candidates) {
          if (prefix && !candidate.startsWith(prefix)) continue;
          if (candidates[candidate] > maxCount) {
            maxCount = candidates[candidate];
            bestWord = candidate;
          }
        }
        if (bestWord) return bestWord;
      }
    }

    // 2. Try Bigram Prediction: w2 -> nextWord matching prefix
    if (w2 && this.transitions[w2]) {
      const candidates = this.transitions[w2];
      let bestWord = null;
      let maxCount = -1;
      for (const candidate in candidates) {
        if (prefix && !candidate.startsWith(prefix)) continue;
        if (candidates[candidate] > maxCount) {
          maxCount = candidates[candidate];
          bestWord = candidate;
        }
      }
      if (bestWord) return bestWord;
    }

    // 3. Try Current Word Prefix Matching from Vocabulary
    if (prefix) {
      let bestWord = null;
      let maxFreq = -1;
      for (const word of this.vocabulary) {
        if (word.startsWith(prefix) && word !== prefix) {
          const freq = this.wordFreq[word] || 0;
          if (freq > maxFreq) {
            maxFreq = freq;
            bestWord = word;
          }
        }
      }
      if (bestWord) return bestWord;

      // 4. Try Common Words matching prefix
      for (const word of this.commonWords) {
        if (word.startsWith(prefix) && word !== prefix) {
          return word;
        }
      }
    }

    return null;
  }

  predict(w1, w2, prefix) {
    let result = [];
    
    let nextWord = this.predictSingleWord(w1, w2, prefix);
    if (!nextWord) return null;
    
    result.push(nextWord);
    
    let prev1 = w2;
    let prev2 = nextWord;
    
    for (let i = 0; i < 3; i++) {
      let followWord = this.predictSingleWord(prev1, prev2, "");
      if (!followWord) break;
      
      const key = prev1 && prev2 ? `${prev1} ${prev2}` : prev2;
      const candidates = prev1 && prev2 ? (this.trigrams[key] || this.transitions[prev2]) : this.transitions[prev2];
      if (!candidates) break;
      
      const totalCount = Object.values(candidates).reduce((a, b) => a + b, 0);
      const count = candidates[followWord] || 0;
      
      if (count / totalCount < 0.35 && count < 2) {
        break;
      }
      
      result.push(followWord);
      prev1 = prev2;
      prev2 = followWord;
    }
    
    return result.join(" ");
  }

  async predictOnline(textBefore) {
    const provider = activeCustomizerPlugin?.settings?.customStyles?.predictionProvider || "local";
    if (provider === "local") {
      return null;
    }

    const maxTokens = activeCustomizerPlugin?.settings?.customStyles?.predictionMaxTokens || 40;
    const systemPrompt = `You are an expert text editor assistant. Your task is two-fold:
1. SPELLING CORRECTION: Scan the last 3 to 4 words of the input text for any obvious spelling mistakes or typos. If a word is misspelled, identify it and provide its correction. Otherwise, set both to null.
2. NEXT-WORD COMPLETION: Predict the natural continuation of the text starting from the very end of the input (the cursor position). You must only return the next 1 to 4 words max (not a full sentence or story continuation).

You MUST return a JSON object with this exact structure:
{
  "misspelled": "the exact misspelled word as it appears in the text, or null if none",
  "correction": "the corrected spelling of that word, or null if none",
  "completion": "the natural next words completing the sentence starting from the cursor"
}

Strict Rules:
- Only correct actual spelling mistakes in the last 3-4 words. Do not correct grammar or style. If unsure, set "misspelled" and "correction" to null.
- The "completion" MUST continue from the very last character of the input.
- The "completion" MUST NOT repeat any words, phrases, or letters that are already present at the end of the input text.
- The "completion" MUST start with a space if it is a new word, but must NOT start with a space if it completes an unfinished word.
- Keep the completion extremely short (strictly 1 to 4 words max). Do NOT suggest a full sentence, write ahead, or overhaul the story. Only suggest the immediate next few words to help the user type.
- Return ONLY the raw JSON object. Do not wrap in markdown code blocks or add any markdown formatting or commentary.`;

    try {
      let rawResponse = null;
      if (provider === "gemini") {
        const apiKey = activeCustomizerPlugin?.settings?.customStyles?.predictionApiKeyGemini;
        if (!apiKey) return null;
        const model = activeCustomizerPlugin?.settings?.customStyles?.predictionModelGemini || "gemini-1.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const promptContent = `${systemPrompt}\n\nInput Text:\n"""\n${textBefore}\n"""\n\nJSON output:`;

        const response = await requestUrl({
          url: url,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: promptContent }]
            }],
            generationConfig: {
              maxOutputTokens: maxTokens,
              temperature: 0.1,
              responseMimeType: "application/json"
            }
          })
        });

        if (response.status === 200) {
          rawResponse = response.json.candidates?.[0]?.content?.parts?.[0]?.text;
        }
      } else if (provider === "openai") {
        const apiKey = activeCustomizerPlugin?.settings?.customStyles?.predictionApiKeyOpenAI;
        if (!apiKey) return null;
        const model = activeCustomizerPlugin?.settings?.customStyles?.predictionModelOpenAI || "gpt-4o-mini";
        const url = "https://api.openai.com/v1/chat/completions";
        
        const userContent = `Analyze this text and provide the completion JSON:
"""
${textBefore}
"""`;

        const response = await requestUrl({
          url: url,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userContent }
            ],
            max_tokens: maxTokens,
            temperature: 0.1
          })
        });

        if (response.status === 200) {
          rawResponse = response.json.choices?.[0]?.message?.content;
        }
      } else if (provider === "ollama") {
        const baseUrl = activeCustomizerPlugin?.settings?.customStyles?.predictionOllamaUrl || "http://localhost:11434";
        const model = activeCustomizerPlugin?.settings?.customStyles?.predictionModelOllama || "gemma4:e4b";
        const url = `${baseUrl}/api/chat`;
        
        const userContent = `Analyze this text and provide the completion JSON:
"""
${textBefore}
"""`;

        const response = await requestUrl({
          url: url,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: model,
            format: "json",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userContent }
            ],
            options: {
              num_predict: maxTokens,
              temperature: 0.1
            },
            stream: false
          })
        });

        if (response.status === 200) {
          rawResponse = response.json.message?.content;
        }
      }

      if (rawResponse) {
        return this.parseJsonResponse(rawResponse);
      }
    } catch (e) {
      console.warn("Prediction API error:", e);
    }
    return null;
  }

  matchCase(original, correction) {
    if (!original || !correction) return correction;
    if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
      if (original.length > 1 && original === original.toUpperCase()) {
        return correction.toUpperCase();
      }
      return correction[0].toUpperCase() + correction.slice(1);
    }
    return correction.toLowerCase();
  }

  findLastWordMatch(text, word) {
    if (!word) return -1;
    const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
    let match;
    let lastIndex = -1;
    while ((match = regex.exec(text)) !== null) {
      lastIndex = match.index;
    }
    return lastIndex;
  }

  parseJsonResponse(rawText) {
    if (!rawText) return null;
    console.log("[Prediction] Parsing raw text response:", rawText);
    
    // Clean up markdown block wraps if model ignored instructions
    rawText = rawText.replace(/```json/i, "").replace(/```/, "").trim();
    
    let misspelled = null;
    let correction = null;
    let completion = "";
    
    const misMatch = rawText.match(/"misspelled[^"]*"\s*:\s*(?:null|"(.*?)"?)(?:\s*,|\s*}|\s*\n|$)/i);
    if (misMatch) {
      misspelled = misMatch[1] === undefined || misMatch[1] === "null" ? null : misMatch[1];
    }
    
    const corrMatch = rawText.match(/"correct[^"]*"\s*:\s*(?:null|"(.*?)"?)(?:\s*,|\s*}|\s*\n|$)/i);
    if (corrMatch) {
      correction = corrMatch[1] === undefined || corrMatch[1] === "null" ? null : corrMatch[1];
    }
    
    const compMatch = rawText.match(/"complet[^"]*"\s*:\s*"(.*?)"?(?:\s*,|\s*}|\s*\n|$)/i);
    if (compMatch) {
      completion = compMatch[1] || "";
    }
    
    // Fallback if no matching keys were found at all
    if (!misMatch && !corrMatch && !compMatch) {
      console.warn("[Prediction] Regex match failed, falling back to raw response");
      return {
        misspelled: null,
        correction: null,
        completion: rawText.trim()
      };
    }
    
    const parsed = { misspelled, correction, completion };
    console.log("[Prediction] Regex parsed JSON values:", parsed);
    return parsed;
  }

  alignCompletion(textBefore, completion) {
    if (!completion) return "";
    
    // Clean up code block backticks and quotes if LLM returned them
    completion = completion.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/, "");
    completion = completion.replace(/^"/, "").replace(/"$/, "");
    completion = completion.replace(/^'/, "").replace(/'$/, "");
    
    if (!completion) return "";

    const endsWithSpace = /\s$/.test(textBefore);
    const startsWithSpace = /^\s/.test(completion);

    if (endsWithSpace && startsWithSpace) {
      completion = completion.trimStart();
    }
    
    return completion;
  }
}

// We will pass the main plugin instance to the prediction plugin
let activeCustomizerPlugin = null;

const predictionViewPlugin = ViewPlugin.fromClass(class {
  constructor(view) {
    this.view = view;
    this.suggestion = "";
    this.fullSuggestion = "";
    this.lastTextBefore = "";
    this.decorations = Decoration.none;
    this.debounceTimer = null;
    this.requestIdCounter = 0;
    this.activeCorrection = null;
  }

  destroy() {
    clearTimeout(this.debounceTimer);
  }

  update(update) {
    if (!activeCustomizerPlugin || !activeCustomizerPlugin.settings?.customStyles?.enablePrediction) {
      this.clearSuggestion();
      return;
    }

    if (update.docChanged || update.selectionSet) {
      this.updateSuggestion();
    }
  }

  updateSuggestion() {
    const state = this.view.state;
    if (state.selection.ranges.length !== 1 || !state.selection.main.empty) {
      this.clearSuggestion();
      return;
    }

    const pos = state.selection.main.head;
    const line = state.doc.lineAt(pos);
    const lineText = line.text;
    const col = pos - line.from;
    const textBefore = lineText.slice(0, col);

    if (textBefore.trim().length === 0) {
      this.clearSuggestion();
      return;
    }

    // 1. Check if we can reuse the current suggestion (incremental typing match)
    if (this.fullSuggestion && this.lastTextBefore && textBefore.startsWith(this.lastTextBefore) && !this.activeCorrection) {
      const typedSinceLast = textBefore.slice(this.lastTextBefore.length);
      if (this.fullSuggestion.startsWith(typedSinceLast)) {
        this.suggestion = this.fullSuggestion.slice(typedSinceLast.length);
        if (this.suggestion) {
          this.renderDecoration(pos);
          return;
        }
      }
    }

    this.clearSuggestion();

    const requestId = ++this.requestIdCounter;
    
    // Grab context from document (last 1000 characters)
    const docText = state.doc.toString();
    const docPos = pos;
    const contextBefore = docText.slice(Math.max(0, docPos - 1000), docPos);

    const debounceDelay = activeCustomizerPlugin?.settings?.customStyles?.predictionDebounce || 300;
    
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(async () => {
      let result = null;
      const provider = activeCustomizerPlugin?.settings?.customStyles?.predictionProvider || "local";
      
      if (provider === "local") {
        const match2 = textBefore.match(/([a-zA-Z0-9'-]+)\s+([a-zA-Z0-9'-]+)\s+([a-zA-Z0-9'-]*)$/);
        const match1 = textBefore.match(/([a-zA-Z0-9'-]+)\s+([a-zA-Z0-9'-]*)$/);
        const match0 = textBefore.match(/^\s*([a-zA-Z0-9'-]*)$/);
        
        let word1 = "";
        let word2 = "";
        let prefix = "";

        if (match2) {
          word1 = match2[1].toLowerCase();
          word2 = match2[2].toLowerCase();
          prefix = match2[3].toLowerCase();
        } else if (match1) {
          word2 = match1[1].toLowerCase();
          prefix = match1[2].toLowerCase();
        } else if (match0) {
          prefix = match0[1].toLowerCase();
        }

        if (word2 || prefix.length >= 2) {
          const localRes = activeCustomizerPlugin.predictionEngine.predict(word1, word2, prefix);
          if (localRes && localRes.startsWith(prefix)) {
            result = {
              misspelled: null,
              correction: null,
              completion: localRes.slice(prefix.length)
            };
          }
        }
      } else {
        result = await activeCustomizerPlugin.predictionEngine.predictOnline(contextBefore);
      }

      if (requestId === this.requestIdCounter) {
        const currentPos = this.view.state.selection.main.head;
        if (currentPos === pos) {
          if (result) {
            const isCorrectorEnabled = activeCustomizerPlugin?.settings?.customStyles?.enableMistakeCorrector;
            if (isCorrectorEnabled && result.misspelled && result.correction && result.correction.toLowerCase() !== result.misspelled.toLowerCase()) {
              // Search for result.misspelled in the last 150 characters of contextBefore
              const searchStart = Math.max(0, contextBefore.length - 150);
              const searchSegment = contextBefore.slice(searchStart);
              const lastIndexInSegment = activeCustomizerPlugin.predictionEngine.findLastWordMatch(searchSegment, result.misspelled);

              if (lastIndexInSegment !== -1) {
                const lastIndex = searchStart + lastIndexInSegment;
                const startPos = Math.max(0, docPos - 1000) + lastIndex;
                const endPos = startPos + result.misspelled.length;

                // Match casing of the original word
                const originalWordInDoc = contextBefore.slice(lastIndex, lastIndex + result.misspelled.length);
                const casedCorrection = activeCustomizerPlugin.predictionEngine.matchCase(originalWordInDoc, result.correction);

                this.activeCorrection = {
                  start: startPos,
                  end: endPos,
                  original: originalWordInDoc,
                  replacement: casedCorrection,
                  completion: result.completion
                };
                this.suggestion = result.completion;
              } else {
                this.activeCorrection = null;
                this.suggestion = result.completion;
                this.fullSuggestion = result.completion;
                this.lastTextBefore = textBefore;
              }
            } else {
              this.activeCorrection = null;
              this.suggestion = result.completion;
              this.fullSuggestion = result.completion;
              this.lastTextBefore = textBefore;
            }
            this.renderDecoration(currentPos);
            this.view.dispatch({});
          }
        }
      }
    }, debounceDelay);
  }

  renderDecoration(pos) {
    const decoArray = [];
    
    if (this.activeCorrection) {
      const widget = Decoration.replace({
        widget: new CorrectionWidget(this.activeCorrection.replacement)
      });
      decoArray.push(widget.range(this.activeCorrection.start, this.activeCorrection.end));
    }
    
    if (this.suggestion) {
      const widget = Decoration.widget({
        widget: new GhostTextWidget(this.suggestion),
        side: 1
      });
      decoArray.push(widget.range(pos));
    }
    
    decoArray.sort((a, b) => a.from - b.from);
    this.decorations = decoArray.length > 0 ? Decoration.set(decoArray) : Decoration.none;
  }

  clearSuggestion() {
    this.suggestion = "";
    this.fullSuggestion = "";
    this.lastTextBefore = "";
    this.decorations = Decoration.none;
    this.activeCorrection = null;
  }
}, {
  decorations: v => v.decorations
});

const predictionKeymap = EditorView.domEventHandlers({
  keydown(event, view) {
    if (event.key === "Alt" && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      if (!activeCustomizerPlugin || !activeCustomizerPlugin.settings?.customStyles?.enablePrediction) {
        return false;
      }
      const plugin = view.plugin(predictionViewPlugin);
      if (plugin && plugin.suggestion) {
        const suggestion = plugin.suggestion;
        const pos = view.state.selection.main.head;
        view.dispatch({
          changes: { from: pos, to: pos, insert: suggestion },
          selection: { anchor: pos + suggestion.length }
        });
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    }
    if (event.key === "Enter") {
      if (!activeCustomizerPlugin || !activeCustomizerPlugin.settings?.customStyles?.enablePrediction || !activeCustomizerPlugin.settings?.customStyles?.enableMistakeCorrector) {
        return false;
      }
      const plugin = view.plugin(predictionViewPlugin);
      if (plugin && plugin.activeCorrection) {
        const { start, end, replacement, completion } = plugin.activeCorrection;
        const pos = view.state.selection.main.head;
        
        view.dispatch({
          changes: [
            { from: start, to: end, insert: replacement },
            { from: pos, to: pos, insert: completion }
          ],
          selection: { anchor: pos + (replacement.length - (end - start)) + completion.length }
        });
        event.preventDefault();
        event.stopPropagation();
        return true;
      }
    }
    return false;
  }
});

class SpellCheckModal extends Modal {
  constructor(app, editor, plugin) {
    super(app);
    this.editor = editor;
    this.plugin = plugin;
    this.suggestions = [];
    this.occurrences = [];
    this.currentIndex = 0;
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    
    contentEl.addClass("spellcheck-modal");
    contentEl.createEl("h2", { text: "🔍 AI Document Spellcheck", cls: "spellcheck-title" });

    const provider = this.plugin.settings?.customStyles?.predictionProvider || "local";
    if (provider === "local") {
      const errorContainer = contentEl.createEl("div", { cls: "spellcheck-error-container" });
      errorContainer.createEl("p", {
        text: "Spelling correction suggestions require an active AI provider (Gemini, OpenAI, or Ollama).",
        cls: "spellcheck-error-text"
      });
      errorContainer.createEl("p", {
        text: "Please configure an AI provider in the Customizer settings panel to use this feature.",
        cls: "spellcheck-error-subtext"
      });
      const closeBtn = contentEl.createEl("button", { text: "Close", cls: "spellcheck-btn spellcheck-btn-close" });
      closeBtn.addEventListener("click", () => this.close());
      return;
    }

    const loadingContainer = contentEl.createEl("div", { cls: "spellcheck-loading-container" });
    loadingContainer.createEl("div", { cls: "spellcheck-spinner" });
    loadingContainer.createEl("p", { text: "Analyzing note for spelling mistakes...", cls: "spellcheck-loading-text" });

    const docText = this.editor.getValue();
    if (!docText.trim()) {
      loadingContainer.remove();
      contentEl.createEl("p", { text: "The note is empty.", cls: "spellcheck-info-text" });
      const closeBtn = contentEl.createEl("button", { text: "Close", cls: "spellcheck-btn spellcheck-btn-close" });
      closeBtn.addEventListener("click", () => this.close());
      return;
    }

    try {
      const suggestions = await this.scanForSpellingMistakes(docText);
      loadingContainer.remove();

      if (!suggestions || suggestions.length === 0) {
        contentEl.createEl("p", { text: "🎉 No spelling mistakes found in the document!", cls: "spellcheck-info-text" });
        const closeBtn = contentEl.createEl("button", { text: "Close", cls: "spellcheck-btn spellcheck-btn-close" });
        closeBtn.addEventListener("click", () => this.close());
        return;
      }

      this.occurrences = this.findAllOccurrences(docText, suggestions);
      if (this.occurrences.length === 0) {
        contentEl.createEl("p", { text: "🎉 No spelling mistakes found in the document!", cls: "spellcheck-info-text" });
        const closeBtn = contentEl.createEl("button", { text: "Close", cls: "spellcheck-btn spellcheck-btn-close" });
        closeBtn.addEventListener("click", () => this.close());
        return;
      }

      this.renderCorrectionUI(contentEl);
    } catch (err) {
      console.error("Spellcheck scan failed:", err);
      loadingContainer.remove();
      contentEl.createEl("p", { text: "Failed to scan document: " + err.message, cls: "spellcheck-error-text" });
      const closeBtn = contentEl.createEl("button", { text: "Close", cls: "spellcheck-btn spellcheck-btn-close" });
      closeBtn.addEventListener("click", () => this.close());
    }
  }

  async scanForSpellingMistakes(docText) {
    const systemPrompt = `You are a spelling correction assistant.
Scan the user's text for spelling mistakes, typos, and obvious misspellings.
Identify each misspelled word and provide its correct spelling.

You MUST return a JSON array containing only objects with this structure:
[
  {
    "misspelled": "the exact misspelled word as it appears in the text (case-sensitive)",
    "correction": "the corrected spelling of that word"
  }
]

Rules:
1. Only include actual spelling mistakes/typos. Do not include grammatical or stylistic suggestions.
2. If the text has no spelling mistakes, return an empty array: [].
3. Misspelled words must be case-sensitive and match the text exactly.
4. Return ONLY the raw JSON array. Do not wrap in markdown code blocks or add commentary.`;

    const provider = this.plugin.settings?.customStyles?.predictionProvider;
    const maxTokens = 500;

    let rawResponse = null;
    if (provider === "gemini") {
      const apiKey = this.plugin.settings?.customStyles?.predictionApiKeyGemini;
      if (!apiKey) throw new Error("Gemini API Key is missing");
      const model = this.plugin.settings?.customStyles?.predictionModelGemini || "gemini-1.5-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const promptContent = `${systemPrompt}\n\nInput Text:\n"""\n${docText}\n"""\n\nJSON output:`;

      const response = await requestUrl({
        url: url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptContent }] }],
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        })
      });
      if (response.status === 200) {
        rawResponse = response.json.candidates?.[0]?.content?.parts?.[0]?.text;
      }
    } else if (provider === "openai") {
      const apiKey = this.plugin.settings?.customStyles?.predictionApiKeyOpenAI;
      if (!apiKey) throw new Error("OpenAI API Key is missing");
      const model = this.plugin.settings?.customStyles?.predictionModelOpenAI || "gpt-4o-mini";
      const url = "https://api.openai.com/v1/chat/completions";
      const userContent = `Analyze this text for spelling mistakes:
"""
${docText}
"""`;

      const response = await requestUrl({
        url: url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent }
          ],
          max_tokens: maxTokens,
          temperature: 0.1
        })
      });
      if (response.status === 200) {
        rawResponse = response.json.choices?.[0]?.message?.content;
      }
    } else if (provider === "ollama") {
      const baseUrl = this.plugin.settings?.customStyles?.predictionOllamaUrl || "http://localhost:11434";
      const model = this.plugin.settings?.customStyles?.predictionModelOllama || "gemma4:e4b";
      const url = `${baseUrl}/api/chat`;
      const userContent = `Analyze this text for spelling mistakes:
"""
${docText}
"""`;

      const response = await requestUrl({
        url: url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          format: "json",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent }
          ],
          options: {
            num_predict: maxTokens,
            temperature: 0.1
          },
          stream: false
        })
      });
      if (response.status === 200) {
        rawResponse = response.json.message?.content;
      }
    }

    if (rawResponse) {
      try {
        const cleanJson = rawResponse.replace(/```json/i, "").replace(/```/, "").trim();
        const parsed = JSON.parse(cleanJson);
        return this.cleanAndNormalizeSuggestions(parsed, rawResponse);
      } catch (e) {
        console.warn("JSON parsing of full spelling scan failed. Attempting regex extraction.", e);
        return this.extractSuggestionsViaRegex(rawResponse);
      }
    }
    return [];
  }

  cleanAndNormalizeSuggestions(parsed, rawResponse) {
    if (!parsed) {
      return this.extractSuggestionsViaRegex(rawResponse);
    }
    
    // 1. If it's already an array
    if (Array.isArray(parsed)) {
      return parsed.filter(item => item && typeof item === "object" && item.misspelled);
    }
    
    // 2. If it's a single correction object
    if (typeof parsed === "object" && parsed !== null) {
      if (parsed.misspelled && parsed.correction) {
        return [parsed];
      }
      
      // 3. If it's an object containing an array inside one of its keys
      for (const key in parsed) {
        if (Array.isArray(parsed[key])) {
          return parsed[key].filter(item => item && typeof item === "object" && item.misspelled);
        }
      }
    }
    
    // 4. Fallback to regex
    return this.extractSuggestionsViaRegex(rawResponse);
  }

  extractSuggestionsViaRegex(rawResponse) {
    if (!rawResponse) return [];
    const results = [];
    const regex = /["']misspelled["']\s*:\s*["']((?:[^"'\\]|\\.)*)["']\s*,\s*["']correction["']\s*:\s*["']((?:[^"'\\]|\\.)*)["']/gi;
    let match;
    while ((match = regex.exec(rawResponse)) !== null) {
      results.push({ misspelled: match[1], correction: match[2] });
    }
    return results;
  }

  findAllOccurrences(docText, suggestions) {
    const occurrences = [];
    if (!Array.isArray(suggestions)) return occurrences;
    suggestions.forEach(s => {
      if (!s.misspelled || !s.correction) return;
      const escaped = s.misspelled.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
      let match;
      while ((match = regex.exec(docText)) !== null) {
        occurrences.push({
          misspelled: match[0],
          correction: s.correction,
          index: match.index,
          length: match[0].length
        });
      }
    });
    occurrences.sort((a, b) => a.index - b.index);
    return occurrences;
  }

  renderCorrectionUI(container) {
    container.empty();
    container.createEl("h2", { text: "🔍 AI Document Spellcheck", cls: "spellcheck-title" });

    const hudRow = container.createEl("div", { cls: "spellcheck-hud" });
    const trustBtn = hudRow.createEl("button", { text: "✨ Trust AI: Fix All Mistakes", cls: "spellcheck-btn spellcheck-btn-trust-ai" });
    trustBtn.addEventListener("click", () => {
      this.applyAllCorrections();
      new Notice("Corrected all spelling mistakes!");
      this.close();
    });

    this.cardWrapper = container.createEl("div", { cls: "spellcheck-card-wrapper" });
    this.renderCurrentCard();

    this.keydownHandler = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.acceptCurrent();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        this.skipCurrent();
      }
    };
    this.modalEl.addEventListener("keydown", this.keydownHandler);
  }

  renderCurrentCard() {
    this.cardWrapper.empty();

    if (this.currentIndex >= this.occurrences.length) {
      this.cardWrapper.createEl("p", { text: "🎉 All mistakes resolved!", cls: "spellcheck-info-text" });
      const doneBtn = this.cardWrapper.createEl("button", { text: "Finish", cls: "spellcheck-btn spellcheck-btn-close" });
      doneBtn.addEventListener("click", () => this.close());
      return;
    }

    const occ = this.occurrences[this.currentIndex];
    const card = this.cardWrapper.createEl("div", { cls: "spellcheck-card" });
    
    card.createEl("div", {
      text: `Mistake ${this.currentIndex + 1} of ${this.occurrences.length}`,
      cls: "spellcheck-progress"
    });

    const casedCorrection = this.plugin.predictionEngine.matchCase(occ.misspelled, occ.correction);

    const diffRow = card.createEl("div", { cls: "spellcheck-diff-row" });
    diffRow.createEl("span", { text: occ.misspelled, cls: "spellcheck-diff-original" });
    diffRow.createEl("span", { text: " ➜ ", cls: "spellcheck-diff-arrow" });
    diffRow.createEl("span", { text: casedCorrection, cls: "spellcheck-diff-corrected" });

    const docText = this.editor.getValue();
    const startContext = Math.max(0, occ.index - 40);
    const endContext = Math.min(docText.length, occ.index + occ.length + 40);
    
    const contextBefore = docText.slice(startContext, occ.index);
    const contextAfter = docText.slice(occ.index + occ.length, endContext);

    const contextEl = card.createEl("div", { cls: "spellcheck-context" });
    contextEl.createEl("span", { text: (startContext > 0 ? "..." : "") + contextBefore });
    contextEl.createEl("span", { text: occ.misspelled, cls: "spellcheck-context-target" });
    contextEl.createEl("span", { text: contextAfter + (endContext < docText.length ? "..." : "") });

    const btnRow = card.createEl("div", { cls: "spellcheck-btn-row" });
    const acceptBtn = btnRow.createEl("button", { text: "Accept (Enter)", cls: "spellcheck-btn spellcheck-btn-accept" });
    const skipBtn = btnRow.createEl("button", { text: "Skip", cls: "spellcheck-btn spellcheck-btn-skip" });

    acceptBtn.addEventListener("click", () => this.acceptCurrent());
    skipBtn.addEventListener("click", () => this.skipCurrent());
  }

  acceptCurrent() {
    const occ = this.occurrences[this.currentIndex];
    this.applyCorrection(occ);
    this.currentIndex++;
    this.renderCurrentCard();
  }

  skipCurrent() {
    this.currentIndex++;
    this.renderCurrentCard();
  }

  applyCorrection(occ) {
    const from = this.editor.offsetToPos(occ.index);
    const to = this.editor.offsetToPos(occ.index + occ.length);
    
    const casedCorrection = this.plugin.predictionEngine.matchCase(occ.misspelled, occ.correction);
    this.editor.replaceRange(casedCorrection, from, to);
    
    const diff = casedCorrection.length - occ.length;
    for (let i = this.currentIndex + 1; i < this.occurrences.length; i++) {
      if (this.occurrences[i].index > occ.index) {
        this.occurrences[i].index += diff;
      }
    }
  }

  applyAllCorrections() {
    const sorted = [...this.occurrences].slice(this.currentIndex).sort((a, b) => b.index - a.index);
    sorted.forEach(occ => {
      const from = this.editor.offsetToPos(occ.index);
      const to = this.editor.offsetToPos(occ.index + occ.length);
      const casedCorrection = this.plugin.predictionEngine.matchCase(occ.misspelled, occ.correction);
      this.editor.replaceRange(casedCorrection, from, to);
    });
  }

  onClose() {
    if (this.keydownHandler) {
      this.modalEl.removeEventListener("keydown", this.keydownHandler);
    }
    const { contentEl } = this;
    contentEl.empty();
  }
}

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
    initSubPlugin("Typewriter Mode", TypewriterPluginClass, "typewriter");
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

    // Set active customizer plugin instance
    activeCustomizerPlugin = this;

    // Initialize prediction engine
    this.predictionEngine = new PredictionEngine(this.app);
    this.app.workspace.onLayoutReady(() => {
      this.predictionEngine.buildModelFromActiveFile();
    });

    this.registerEvent(
      this.app.workspace.on("active-leaf-change", () => {
        this.predictionEngine.buildModelFromActiveFile();
      })
    );

    let debounceTimer;
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        const activeFile = this.app.workspace.getActiveFile();
        if (activeFile && file.path === activeFile.path) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            this.predictionEngine.buildModelFromActiveFile();
          }, 3000);
        }
      })
    );

    this.registerEditorExtension([predictionViewPlugin, predictionKeymap]);

    // Register global spellcheck hotkey command
    this.addCommand({
      id: "open-spellcheck-suggestions",
      name: "Show spelling correction suggestions",
      hotkeys: [{ modifiers: ["Ctrl", "Alt"], key: " " }],
      editorCallback: (editor, view) => {
        new SpellCheckModal(this.app, editor, this).open();
      }
    });
  }

  async migrateSettingsIfNeeded() {
    const mainData = await this.loadData() || {};
    let modified = false;

    const migrations = [
      { key: "typewriter", path: ".obsidian/plugins/typewriter-mode/data.json" }
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
        fontTitle: "",
        fontHeadings: "",
        fontInterface: "",
        fontText: "Sailec Light",
        titleColor: "",
        accentColor: "",
        bgColor: "",
        sidebarColor: "",
        bgAltColor: "",
        borderColor: "",
        hoverColor: "",
        textNormalColor: "",
        textMutedColor: "",
        textFaintColor: "",
        cardBgColor: "",
        cardBorderColor: "",
        h1Color: "",
        h2Color: "",
        h3Color: "",
        h4Color: "",
        h5Color: "",
        h6Color: "",
        hideAttachments: true,
        attachmentsPath: "attachments",
        hideIcons: true,
        hideSearchAndBookmarks: true,
        hideFileExplorerButtons: true,
        mermaidResize: true,
        mermaidMaxWidth: "600px",
        colouredCallouts: true,
        customCSS: "",
        enablePrediction: true,
        predictionProvider: "local",
        predictionApiKeyGemini: "",
        predictionModelGemini: "gemini-1.5-flash",
        predictionApiKeyOpenAI: "",
        predictionModelOpenAI: "gpt-4o-mini",
        predictionOllamaUrl: "http://localhost:11434",
        predictionModelOllama: "gemma4:e4b",
        predictionMaxTokens: 25,
        predictionDebounce: 300,
        enableMistakeCorrector: true
      };
      await this.saveData(data);
    } else {
      let modified = false;
      if (data.customStyles.enablePrediction === undefined) {
        data.customStyles.enablePrediction = true;
        modified = true;
      }
      if (data.customStyles.predictionProvider === undefined) {
        data.customStyles.predictionProvider = "local";
        data.customStyles.predictionApiKeyGemini = "";
        data.customStyles.predictionModelGemini = "gemini-1.5-flash";
        data.customStyles.predictionApiKeyOpenAI = "";
        data.customStyles.predictionModelOpenAI = "gpt-4o-mini";
        data.customStyles.predictionOllamaUrl = "http://localhost:11434";
        data.customStyles.predictionModelOllama = "gemma4:e4b";
        data.customStyles.predictionMaxTokens = 25;
        data.customStyles.predictionDebounce = 300;
        data.customStyles.enableMistakeCorrector = true;
        modified = true;
      } else {
        if (data.customStyles.predictionMaxTokens === undefined || data.customStyles.predictionMaxTokens < 25) {
          data.customStyles.predictionMaxTokens = 25;
          modified = true;
        }
        if (data.customStyles.enableMistakeCorrector === undefined) {
          data.customStyles.enableMistakeCorrector = true;
          modified = true;
        }
      }
      if (modified) {
        await this.saveData(data);
      }
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

    // 1. Base UI & editor customisations
    let hasBodyProps = s.fontInterface || s.fontText;
    if (hasBodyProps) {
      css += `body {\n`;
      if (s.fontInterface) css += `  --font-interface: '${s.fontInterface}', sans-serif !important;\n`;
      if (s.fontText) css += `  --font-text: '${s.fontText}', sans-serif !important;\n`;
      css += `}\n`;
    }

    // 2. Custom header & title fonts
    if (s.fontTitle || s.fontHeadings) {
      css += `
        @import url('https://fonts.googleapis.com/css2?family=Zalando+Sans+Expanded:ital,wght@0,200..900;1,200..900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Zalando+Sans+SemiExpanded:ital,wght@0,200..900;1,200..900&display=swap');
      `;
      if (s.fontTitle) {
        css += `
          .inline-title {
              font-family: '${s.fontTitle}', sans-serif !important;
              font-weight: 700;
          }
        `;
      }
      if (s.fontHeadings) {
        css += `
          .cm-header-1, h1, .cm-header-2, h2, .cm-header-3, h3, .cm-header-4, h4, .cm-header-5, h5, .cm-header-6, h6 {
              font-family: '${s.fontHeadings}', sans-serif !important;
              font-weight: 700;
          }
        `;
      }
    }

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

    // 11. Coloured callouts
    if (s.colouredCallouts) {
      css += `
        .callout[data-callout="motor"] {
          --callout-color: 218, 218, 218;
          --callout-icon: lucide-cog;
        }
        .callout[data-callout="generator"] {
          --callout-color: 177, 177, 177;
          --callout-icon: lucide-zap;
        }
        .callout[data-callout="transformer"] {
          --callout-color: 127, 127, 127;
          --callout-icon: lucide-refresh-cw;
        }
        .callout[data-callout="principle"] {
          --callout-color: 255, 255, 255;
          --callout-icon: lucide-atom;
        }
      `;
    }

    // 12. Raw custom CSS
    if (s.customCSS) {
      css += `\n/* --- Custom CSS Snippet --- */\n${s.customCSS}\n`;
    }

    // 13. File breadcrumbs style
    css += `
      .inferno-file-breadcrumb {
        display: flex;
        align-items: center;
        gap: var(--size-4-1);
        padding: var(--size-4-2) var(--size-4-4);
        background: var(--background-primary-alt);
        border-bottom: 1px solid var(--background-modifier-border);
        font-size: var(--font-ui-smaller);
        color: var(--text-muted);
        font-family: var(--font-interface);
        user-select: none;
        flex-wrap: wrap;
      }
      .inferno-file-breadcrumb .breadcrumb-item {
        cursor: pointer;
        transition: color 0.15s ease;
      }
      .inferno-file-breadcrumb .breadcrumb-item:hover {
        color: var(--text-normal);
      }
      .inferno-file-breadcrumb .breadcrumb-item.is-active {
        cursor: default;
        color: var(--text-faint);
      }
      .inferno-file-breadcrumb .breadcrumb-divider {
        display: flex;
        align-items: center;
        color: var(--text-faint);
      }
      .inferno-file-breadcrumb .breadcrumb-divider svg {
        width: 12px;
        height: 12px;
      }
    `;

    // 14. Hide native file path breadcrumbs in view header
    css += `
      .view-header-breadcrumb,
      .view-header-breadcrumb-separator {
        display: none !important;
      }
    `;

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

    const header = containerEl.createEl("div", { cls: "customizer-settings-container" });
    header.createEl("h1", { text: "Inferno's Customizer Hub" });
    header.createEl("p", { 
      text: "Consolidated system settings for styling, UI elements, and sub-plugins.",
      cls: "customizer-settings-description"
    });

    const s = this.plugin.settings.customStyles || {};

    // --- SECTION 1: SUPER STYLING CUSTOMISATIONS ---
    const styleSection = containerEl.createEl("details", { cls: "customizer-section", open: true });
    styleSection.createEl("summary", { text: "🎨 Super Styling & Interface Design", cls: "customizer-section-summary" });
    const styleContent = styleSection.createEl("div", { cls: "customizer-section-content" });



    // TYPOGRAPHY FAMILIES SUB-HEADING
    styleContent.createEl("h3", { text: "Typography Customisations", cls: "customizer-subheading" });

    // Title Font Family
    new Setting(styleContent)
      .setName("Title font family")
      .addText(cb => cb.setPlaceholder("Zalando Sans Expanded").setValue(s.fontTitle).onChange(async val => {
        s.fontTitle = val;
        await this.plugin.saveSettings();
      }));

    // Headings Font Family
    new Setting(styleContent)
      .setName("Headings font family")
      .addText(cb => cb.setPlaceholder("Zalando Sans SemiExpanded").setValue(s.fontHeadings).onChange(async val => {
        s.fontHeadings = val;
        await this.plugin.saveSettings();
      }));

    // Interface Font Family
    new Setting(styleContent)
      .setName("Interface font family")
      .addText(cb => cb.setPlaceholder("sailec").setValue(s.fontInterface).onChange(async val => {
        s.fontInterface = val;
        await this.plugin.saveSettings();
      }));

    // Editor Font Family
    new Setting(styleContent)
      .setName("Editor text font family")
      .addText(cb => cb.setPlaceholder("sailec").setValue(s.fontText).onChange(async val => {
        s.fontText = val;
        await this.plugin.saveSettings();
      }));

    // INTERFACE CUSTOMISATIONS SUB-HEADING
    styleContent.createEl("h3", { text: "Vault Interface Elements", cls: "customizer-subheading" });

    // Hide Attachments
    new Setting(styleContent)
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

    // Hide Ribbon Icons
    new Setting(styleContent)
      .setName("Hide ribbon icons")
      .setDesc("Hide sidebar options ribbon (except Calendar icon).")
      .addToggle(cb => cb.setValue(s.hideIcons).onChange(async val => {
        s.hideIcons = val;
        await this.plugin.saveSettings();
      }));

    // Hide Search & Bookmarks
    new Setting(styleContent)
      .setName("Hide search & bookmarks")
      .setDesc("Hide Search and Bookmarks shortcuts from top header bar.")
      .addToggle(cb => cb.setValue(s.hideSearchAndBookmarks).onChange(async val => {
        s.hideSearchAndBookmarks = val;
        await this.plugin.saveSettings();
      }));

    // Hide File Explorer buttons
    new Setting(styleContent)
      .setName("Hide file explorer top buttons")
      .setDesc("Hide options in file explorer header (except Collapse all icon).")
      .addToggle(cb => cb.setValue(s.hideFileExplorerButtons).onChange(async val => {
        s.hideFileExplorerButtons = val;
        await this.plugin.saveSettings();
      }));

    // Mermaid Resize
    new Setting(styleContent)
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

    // Coloured Callouts
    new Setting(styleContent)
      .setName("Custom coloured callouts")
      .addToggle(cb => cb.setValue(s.colouredCallouts).onChange(async val => {
        s.colouredCallouts = val;
        await this.plugin.saveSettings();
      }));

    // Next Word Prediction Toggle
    styleContent.createEl("h3", { text: "Text Editing & Prediction", cls: "customizer-subheading" });

    new Setting(styleContent)
      .setName("Enable Next Word Prediction")
      .setDesc("Predict next words or auto-complete the current word as you type. Press Alt to accept predictions.")
      .addToggle(cb => cb.setValue(!!s.enablePrediction).onChange(async val => {
        s.enablePrediction = val;
        await this.plugin.saveSettings();
        this.display(); // Refresh settings UI to show/hide sub-settings
      }));

    if (s.enablePrediction) {
      new Setting(styleContent)
        .setName("Enable Auto-Mistake Corrector")
        .setDesc("Highlight and suggest corrections for misspelled words. Press Enter to apply the correction, or keep typing to ignore.")
        .addToggle(cb => cb.setValue(!!s.enableMistakeCorrector).onChange(async val => {
          s.enableMistakeCorrector = val;
          await this.plugin.saveSettings();
        }));

      new Setting(styleContent)
        .setName("Prediction Provider")
        .setDesc("Choose between local N-Gram engine, or premium cloud/local AI model completions.")
        .addDropdown(cb => cb
          .addOption("local", "Local (N-Gram Trigram Engine)")
          .addOption("gemini", "Google Gemini (Fast Cloud)")
          .addOption("openai", "OpenAI GPT (Cloud)")
          .addOption("ollama", "Ollama (Local LLM)")
          .setValue(s.predictionProvider || "local")
          .onChange(async val => {
            s.predictionProvider = val;
            await this.plugin.saveSettings();
            this.display(); // Refresh to update fields
          })
        );

      if (s.predictionProvider === "gemini") {
        new Setting(styleContent)
          .setName("Gemini API Key")
          .setDesc("Enter your Google AI Studio API key.")
          .addText(cb => {
            cb.setPlaceholder("AIzaSy...")
              .setValue(s.predictionApiKeyGemini || "")
              .onChange(async val => {
                s.predictionApiKeyGemini = val.trim();
                await this.plugin.saveSettings();
              });
            cb.inputEl.type = "password";
          });

        new Setting(styleContent)
          .setName("Gemini Model")
          .setDesc("Select which Gemini model to use for completion.")
          .addDropdown(cb => cb
            .addOption("gemini-1.5-flash", "Gemini 1.5 Flash (Recommended - Super Fast)")
            .addOption("gemini-1.5-pro", "Gemini 1.5 Pro (High Quality)")
            .setValue(s.predictionModelGemini || "gemini-1.5-flash")
            .onChange(async val => {
              s.predictionModelGemini = val;
              await this.plugin.saveSettings();
            })
          );
      }

      if (s.predictionProvider === "openai") {
        new Setting(styleContent)
          .setName("OpenAI API Key")
          .setDesc("Enter your OpenAI API key.")
          .addText(cb => {
            cb.setPlaceholder("sk-...")
              .setValue(s.predictionApiKeyOpenAI || "")
              .onChange(async val => {
                s.predictionApiKeyOpenAI = val.trim();
                await this.plugin.saveSettings();
              });
            cb.inputEl.type = "password";
          });

        new Setting(styleContent)
          .setName("OpenAI Model")
          .setDesc("Select which GPT model to use for completion.")
          .addDropdown(cb => cb
            .addOption("gpt-4o-mini", "GPT-4o Mini (Recommended - Fast)")
            .addOption("gpt-4o", "GPT-4o (Smartest)")
            .setValue(s.predictionModelOpenAI || "gpt-4o-mini")
            .onChange(async val => {
              s.predictionModelOpenAI = val;
              await this.plugin.saveSettings();
            })
          );
      }

      if (s.predictionProvider === "ollama") {
        new Setting(styleContent)
          .setName("Ollama Base URL")
          .setDesc("The local URL where Ollama is running.")
          .addText(cb => cb
            .setPlaceholder("http://localhost:11434")
            .setValue(s.predictionOllamaUrl || "http://localhost:11434")
            .onChange(async val => {
              s.predictionOllamaUrl = val.trim();
              await this.plugin.saveSettings();
            })
          );

        new Setting(styleContent)
          .setName("Ollama Model")
          .setDesc("The model name loaded in Ollama (e.g. gemma4:e4b, qwen2.5:1.5b). You can type any local model name here.")
          .addText(cb => cb
            .setPlaceholder("gemma4:e4b")
            .setValue(s.predictionModelOllama || "gemma4:e4b")
            .onChange(async val => {
              s.predictionModelOllama = val.trim();
              await this.plugin.saveSettings();
            })
          );
      }

      if (s.predictionProvider !== "local") {
        new Setting(styleContent)
          .setName("Max Prediction Length (Tokens)")
          .setDesc("The maximum length of the predicted suggestion (1 token ≈ 4 characters).")
          .addSlider(cb => cb
            .setLimits(5, 50, 5)
            .setDynamicTooltip()
            .setValue(s.predictionMaxTokens || 15)
            .onChange(async val => {
              s.predictionMaxTokens = val;
              await this.plugin.saveSettings();
            })
          );

        new Setting(styleContent)
          .setName("Autocomplete Delay (ms)")
          .setDesc("Wait time of no typing before requesting suggestion (lower = faster, higher = fewer API calls).")
          .addSlider(cb => cb
            .setLimits(100, 1000, 50)
            .setDynamicTooltip()
            .setValue(s.predictionDebounce || 300)
            .onChange(async val => {
              s.predictionDebounce = val;
              await this.plugin.saveSettings();
            })
          );
      }
    }

    // Custom CSS Text Area
    new Setting(styleContent)
      .setName("Custom CSS styles")
      .setDesc("Write or paste raw CSS styles here to override elements directly.")
      .addTextArea(cb => cb.setPlaceholder("/* Custom CSS overrides */").setValue(s.customCSS).onChange(async val => {
        s.customCSS = val;
        await this.plugin.saveSettings();
      }));


    // --- SECTION 2+: CHILD PLUGIN SETTINGS ---
    this.plugin.subSettingTabs.forEach(({ name, tab, key }) => {
      const section = containerEl.createEl("details", { cls: "customizer-section" });
      section.createEl("summary", { text: `🔌 Plugin: ${name}`, cls: "customizer-section-summary" });
      const content = section.createEl("div", { cls: "customizer-section-content" });
      
      tab.containerEl = content;
      try {
        tab.display();
      } catch (e) {
        console.error(`Error displaying setting tab for ${name}:`, e);
        content.createEl("p", { text: `Failed to load settings tab for ${name}.` });
      }
    });
  }
}
