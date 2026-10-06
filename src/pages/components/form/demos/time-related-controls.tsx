import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Form } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { Button } from "@/components/ui/button";
import { message } from "@/components/ui/message";

type Values = {
  date?: Dayjs;
  datetime?: Dayjs;
  month?: Dayjs;
  range?: Dayjs[];
  time?: Dayjs;
};

export default function Demo() {
  return (
    <Form<Values>
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      className="max-w-md"
      initialValues={{ date: dayjs(), range: [dayjs(), dayjs().add(7, "day")] }}
      onFinish={({ date, time }) => {
        message.success(
          `date=${date ? date.format("YYYY-MM-DD") : "-"} time=${time ? time.format("HH:mm") : "-"}`,
        );
      }}
    >
      <Form.Item name="date" label="Date" rules={[{ required: true, type: "date" }]}>
        <DatePicker className="w-full" />
      </Form.Item>

      <Form.Item name="datetime" label="Date & time">
        <DatePicker showTime className="w-full" />
      </Form.Item>

      <Form.Item name="month" label="Month">
        <DatePicker picker="month" className="w-full" />
      </Form.Item>

      <Form.Item name="range" label="Range">
        <DatePicker.RangePicker className="w-full" />
      </Form.Item>

      <Form.Item name="time" label="Time">
        <TimePicker className="w-full" />
      </Form.Item>

      <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
