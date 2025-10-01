
import DatePickerReact from "react-datepicker";

interface DatePickerProps {
  title: string;
  targetDate: Date | null;
  setTargetDate: React.Dispatch<React.SetStateAction<Date>>;
}

function DatePicker({title, targetDate, setTargetDate, }: DatePickerProps) {
    return ( 
      <div>
        <h3>{title}</h3>
        <DatePickerReact className="form-select" selected={targetDate} onChange={(date) => setTargetDate(date as Date)}></DatePickerReact>
      </div>
    )
}

export default DatePicker;