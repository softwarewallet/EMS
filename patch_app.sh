sed -i "/import { InventoryWorkspace }/a import { AssetManagementWorkspace } from './components/asset/AssetManagementWorkspace';" src/App.tsx
sed -i "/<Route path=\"\/inventory\/workspace\" element={<InventoryWorkspace \/>} \/>/a \            <Route path=\"\/asset\/workspace\" element={<AssetManagementWorkspace />} />" src/App.tsx
