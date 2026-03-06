import StoreSettings from "./StoreSettings";

const SettingsContent = ({
  storeSettings,
  onStoreSettingsChange,
}) => {
  return (
    <div className="space-y-6">
      <StoreSettings
        settings={storeSettings}
        onChange={onStoreSettingsChange}
      />
    </div>
  );
};

export default SettingsContent;