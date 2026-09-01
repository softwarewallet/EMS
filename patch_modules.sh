sed -i "/import { InventoryModule } from '.\/inventory\/InventoryModule';/a import { AssetModule } from './asset/AssetModule';" src/modules/index.ts
sed -i "/ModuleEngine.register(InventoryModule);/a \  } catch (err) {}\n  try {\n    ModuleEngine.register(AssetModule);" src/modules/index.ts
