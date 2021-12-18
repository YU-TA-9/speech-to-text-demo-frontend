import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

export const Home = () => {
  return (
    <Container className="m-sm-4">
      <Row className="mb-sm-4">
        <Col className="text-left">
          <h1>Speech-to-Text TOP</h1>
        </Col>
      </Row>
      <Row className="mb-sm-4">
        <Col className="text-left">
          <Link to="/demo">デモページ</Link>
        </Col>
      </Row>
    </Container>
  );
};
