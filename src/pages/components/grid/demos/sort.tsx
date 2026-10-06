import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary py-4 text-center text-white";
const boxLight = "rounded-none bg-primary-hover py-4 text-center text-white";

export default function Demo() {
  return (
    <Row>
      <Col span={18} push={6}><div className={box}>col-18 col-push-6</div></Col>
      <Col span={6} pull={18}><div className={boxLight}>col-6 col-pull-18</div></Col>
    </Row>
  );
}
