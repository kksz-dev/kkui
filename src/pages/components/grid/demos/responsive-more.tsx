import { Row, Col } from "@/components/ui/grid";

const box = "rounded-none bg-primary py-4 text-center text-white";
const boxLight = "rounded-none bg-primary-hover py-4 text-center text-white";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">justify per breakpoint (resize the window)</p>
      <Row
        className="bg-fill-quaternary"
        justify={{ xs: "center", sm: "start", md: "end", lg: "space-between", xl: "space-around", xxl: "space-evenly" }}
      >
        <Col span={4}><div className={box}>Col</div></Col>
        <Col span={4}><div className={boxLight}>Col</div></Col>
        <Col span={4}><div className={box}>Col</div></Col>
      </Row>

      <p className="text-text-secondary">align per breakpoint</p>
      <Row className="h-[100px] bg-fill-quaternary" align={{ xs: "top", sm: "middle", md: "bottom", lg: "middle" }}>
        <Col span={4}><div className={box}>Col</div></Col>
        <Col span={4}><div className={boxLight}>Col</div></Col>
        <Col span={4}><div className={box}>Col</div></Col>
      </Row>
    </div>
  );
}
