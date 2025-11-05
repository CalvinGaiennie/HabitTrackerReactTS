import type { ModeType } from "../types/general";

interface SubPageProps {
    title: string;
    mode: ModeType;
    setMode: (mode: ModeType) => void;
}

function SubPage({title, mode, setMode }: SubPageProps) {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>{ title }</h2>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as ModeType)}
                className="form-select"
                style={{ width: "auto" }}
              >
                <option value="add">Add</option>
                <option value="edit">Edit</option>
                <option value="view">View</option>
              </select>
            </div>
        </div>
    )
}
export default SubPage