import { Typography } from "@/components/ui/typography";
import { Divider } from "@/components/ui/divider";

const { Title, Paragraph, Text, Link } = Typography;

const blockContent = `KKUI design language is a design language for background applications, refined by the same values that made KKUI a standard for enterprise UI.

We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.`;

export default function Demo() {
  return (
    <Typography>
      <Title>Introduction</Title>
      <Paragraph>
        In the process of internal desktop applications development, many different design specs and implementations
        would be involved, which might cause designers and developers difficulties and duplication and reduce the
        efficiency of development.
      </Paragraph>
      <Paragraph>
        After massive project practice and summaries, KKUI, a design language for background applications, is
        refined, which aims to <Text strong>uniform the user interface specs for internal background projects, lower the
        unnecessary cost of design differences and implementation and liberate the resources of design and front-end
        development</Text>.
      </Paragraph>
      <Title level={2}>Guidelines and Resources</Title>
      <Paragraph>
        We supply a series of design principles, practical patterns and high quality design resources (<Text code>Sketch</Text>{" "}
        and <Text code>Axure</Text>), to help people create their product prototypes beautifully and efficiently.
      </Paragraph>
      <Paragraph>
        <ul className="list-disc pl-5">
          <li><Link href="/docs/spec/proximity">Principles</Link></li>
          <li><Link href="/docs/spec/overview">Patterns</Link></li>
          <li><Link href="/docs/resources">Resource Download</Link></li>
        </ul>
      </Paragraph>
      <Paragraph>
        Press <Text keyboard>Esc</Text> to exit...
      </Paragraph>
      <Divider />
      <Title>Introduction</Title>
      <Paragraph>
        In the process of internal desktop applications development, many different design specs and implementations
        would be involved.
      </Paragraph>
      <Paragraph>
        <blockquote className="my-4 border-l-4 border-border-secondary pl-3 text-text-secondary">{blockContent}</blockquote>
        <pre className="my-4 overflow-auto rounded-md border border-border-secondary bg-fill-tertiary p-3 font-mono text-[85%] whitespace-pre-wrap">{blockContent}</pre>
      </Paragraph>
    </Typography>
  );
}
