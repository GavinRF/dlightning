// Component registry module — see docs/component-module-migration.md
// adjustableSpace: blank spacer; shows a dashed outline on hover so it's visible while editing.
// The outline is CSS (css/componentVariants.css), not an inline style set on mouseenter/leave:
// that style was part of the component's html, so every hover was saved and live-synced (peers
// rebuilt the spacer, which replayed its blue pulse — the "blinking spacer"). Inline outlines
// older builds saved are removed by screen-schema migration 3.
window.Components = window.Components || {};

window.Components.adjustableSpace = {
    setup() {}
};
