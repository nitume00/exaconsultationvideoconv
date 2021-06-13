function requireAll(r) { r.keys().forEach(r); }
requireAll(require.context('/video/res/', true));