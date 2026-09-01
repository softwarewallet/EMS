const fs = require('fs');
let code = fs.readFileSync('src/services/navigationService.ts', 'utf8');

if (!code.includes('ModuleEngine.getAllModules')) {
  code = code.replace(
    'this.initialized = true;',
    `
    // Auto-inject Universal Module Contract navigation items
    ModuleEngine.getAllModules().forEach(module => {
      if (module.navigationItems) {
        module.navigationItems.forEach(item => {
          this.dynamicRegistry.set(item.id, { ...item, moduleId: module.moduleId });
        });
      }
    });
    this.initialized = true;
    `
  );
  
  // ensure ModuleEngine is imported
  if (!code.includes('import { ModuleEngine }')) {
    code = `import { ModuleEngine } from '../core/modules/ModuleEngine';\n` + code;
  }
  
  fs.writeFileSync('src/services/navigationService.ts', code);
}
