import { useState, } from "react";
import SettingsEdit from "../components/SettingsEdit.tsx";

function WorkoutPageSettings() {
      const [isEditingSettings, setIsEditingSettings] = useState(false);
      const [isSavingSettings, setIsSavingSettings] = useState(false);
      const [settingsSaveMessage, setSettingsSaveMessage] = useState<{
        type: "success" | "error";
        text: string;
      } | null>(null);
      
      
        const handleEditSettings = () => {
          setIsEditingSettings(true);
          setSettingsSaveMessage(null);
        };
      
        const handleCancelSettings = () => {
          setIsEditingSettings(false);
          setSettingsSaveMessage(null);
        };
      
        const handleSaveSettings = async () => {
          setIsSavingSettings(true);
          setSettingsSaveMessage(null);
      
          try {
            // Call the save function from SettingsEdit component
            if ((window as unknown as Record<string, unknown>).settingsSaveRef) {
              await (
                (window as unknown as Record<string, unknown>)
                  .settingsSaveRef as () => Promise<void>
              )();
            }
            setIsEditingSettings(false);
            setSettingsSaveMessage({
              type: "success",
              text: "Settings saved successfully!",
            });
          } catch (error) {
            console.error("Failed to save settings:", error);
            setSettingsSaveMessage({
              type: "error",
              text: "Failed to save settings. Please try again.",
            });
          } finally {
            setIsSavingSettings(false);
          }
        }; 

    return (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Settings</h2>
              <div>
                {!isEditingSettings ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleEditSettings}
                  >
                    Edit Settings
                  </button>
                ) : (
                  <div className="btn-group">
                    <button
                      className="btn btn-success"
                      onClick={handleSaveSettings}
                      disabled={isSavingSettings}
                    >
                      {isSavingSettings ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCancelSettings}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <SettingsEdit
              isEditing={isEditingSettings}
              onSave={handleSaveSettings}
              saveMessage={settingsSaveMessage}
            />
          </div>
        );
}
export default WorkoutPageSettings