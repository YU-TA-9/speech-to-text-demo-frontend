import * as React from "react";
import axios from "axios";
import { DEMO_API_TRANSCRIBE_ENDPOINT, DEMO_API_SEARCH_ENDPOINT } from "../api/endpoint";
import { Container, Row, Col, Form, Button, Accordion, Card, Table, Spinner } from "react-bootstrap";

export const Demo = () => {
  type SearchResult = {
    position: number;
    surrounding: string;
  };

  type SearchResponse = {
    target: string;
    searchResult: SearchResult[];
  };

  type TranscribeResponse = {
    original: string;
  };

  const [file, setFile] = React.useState<any>(null);
  const [transcribedText, setTranscribedText] = React.useState<string>("");
  const [targets, setTargets] = React.useState<string[]>([""]);
  const [result, setResult] = React.useState<SearchResponse[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [transcribeLoading, setTranscribeLoading] = React.useState<boolean>(false);

  const handleChangeFile = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleTranscribe = async (e: any) => {
    e.preventDefault();
    setTranscribeLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post<TranscribeResponse>(
        `http://localhost:8080/api${DEMO_API_TRANSCRIBE_ENDPOINT}`,
        formData
      );
      setTranscribedText(data.original);
    } catch (e) {
      // Todo:エラー時に文言出力
      console.error(e);
    } finally {
      setTranscribeLoading(false);
    }
  };

  const handleChange = (e: any, index: number) => {
    const targetsCopy = targets.concat();
    targetsCopy.splice(index, 1, e.target.value);
    setTargets(targetsCopy);
  };

  const handleAdd = () => {
    const targetsCopy = targets.concat();
    targetsCopy.push("");
    setTargets(targetsCopy);
  };

  const handleDelete = (e: any, index: number) => {
    const targetsCopy = targets.concat();
    targetsCopy.splice(index, 1);
    setTargets(targetsCopy);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // reset
    setResult([]);
    // create param
    let param: string = `original=${transcribedText}`;
    targets.forEach((target) => (param += `&targets=${target}`));

    setLoading(true);
    try {
      const { data } = await axios.get<SearchResponse[]>(
        `http://localhost:8080/api${DEMO_API_SEARCH_ENDPOINT}?${param}`
      );
      setResult(data);
    } catch (e) {
      // Todo:エラー時に文言出力
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createPreviewString = (origin: string, target: string, position: number) => {
    let prefix;
    let suffix;

    if (position <= 5) {
      // 先頭周辺文字が指定文字数以下
      prefix = origin.substring(0, position - 1);
      suffix = origin.substring(origin.length - 5, origin.length);
    } else if (position > transcribedText.length - 5) {
      // 末尾周辺文字が指定文字数以下
      prefix = origin.substring(0, 5);
      suffix = transcribedText.substring(
        transcribedText.length - (transcribedText.length - (position + target.length - 1)),
        transcribedText.length
      );
    } else {
      prefix = origin.substring(0, 5);
      suffix = origin.substring(origin.length - 5, origin.length);
    }
    return (
      <>
        {prefix}
        <span className="text-danger font-weight-bold">{target}</span>
        {suffix}
      </>
    );
  };

  return (
    <Container className="m-sm-4">
      <Row className="mb-sm-4">
        <Col className="text-left">
          <h1>Speech-to-Text DEMO</h1>
        </Col>
      </Row>
      <Row className="mb-sm-4 border-bottom border-dark">
        <Col className="text-left">
          <h4>音声 → テキスト</h4>
        </Col>
      </Row>

      <Row>
        <Col className="text-left">
          <p>テキストに変換したい音声ファイルを選択します。</p>
        </Col>
      </Row>
      <Form>
        <Form.Group className="text-left">
          {/* Todo:音声ファイルのみしか受け付けないようにする */}
          <Form.File id="formControlFile" onChange={handleChangeFile} />
        </Form.Group>
        <Row className="mb-sm-4">
          <Col className="text-left">
            <Button variant="primary" type="button" onClick={handleTranscribe} disabled={loading || file === null}>
              変換
            </Button>
          </Col>
        </Row>
        <Row className="mb-sm-4">
          <Col>
            <Card>
              <Card.Body className="text-left">
                <Card.Title>変換結果</Card.Title>
                {transcribeLoading ? (
                  <Spinner animation="border" />
                ) : transcribedText !== "" ? (
                  <Card.Text>{transcribedText}</Card.Text>
                ) : (
                  <Card.Text>※こちらに表示されます</Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
      <Row className="mb-sm-4 border-bottom border-dark">
        <Col className="text-left">
          <h4>文字検索</h4>
        </Col>
      </Row>
      <Row>
        <Col className="text-left">
          <p>上記の変換結果から検索できます。</p>
        </Col>
      </Row>
      <Form>
        {targets.map((target: any, i: number) => (
          <Form.Group as={Row} controlId={`form${i}`} key={i} className="text-left">
            <Form.Label column sm="2">
              検索ワード{i + 1}
            </Form.Label>
            <Col sm="4">
              <Form.Control
                type="text"
                value={target}
                placeholder="検索したい文字を入力"
                onChange={(e) => handleChange(e, i)}
                disabled={loading}
              />
            </Col>
            <Col sm="3">
              <Button variant="danger" type="button" onClick={(e) => handleDelete(e, i)} disabled={loading}>
                削除
              </Button>
            </Col>
          </Form.Group>
        ))}
        <Row className="mb-sm-4">
          <Col className="text-left">
            <Button variant="secondary" type="button" onClick={handleAdd} disabled={loading}>
              追加
            </Button>
          </Col>
        </Row>
        <Row className="mb-sm-4">
          <Col className="text-left">
            <Button
              variant="primary"
              type="button"
              onClick={handleSubmit}
              disabled={loading || targets.length === 0 || targets.indexOf("") > -1 || transcribedText === ""}
            >
              検索
            </Button>
          </Col>
        </Row>
      </Form>
      <Card>
        <Card.Body className="text-left">
          <Card.Title>検索結果</Card.Title>
          {loading ? (
            <Spinner animation="border" />
          ) : result.length > 0 ? (
            <>
              {result.map((search, i) => (
                <Accordion key={i}>
                  <Card>
                    <Accordion.Toggle as={Card.Header} variant="link" eventKey={String(i)} className="text-left">
                      {`「${search.target}」：${search.searchResult ? search.searchResult.length : 0}箇所`}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={String(i)}>
                      <Card.Body>
                        {search.searchResult ? (
                          <Table responsive className="mb-sm-0">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>文字位置</th>
                                <th>プレビュー</th>
                              </tr>
                            </thead>
                            <tbody>
                              {search.searchResult.map((elem, i) => (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>{elem.position}</td>
                                  <td>{createPreviewString(elem.surrounding, search.target, elem.position)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        ) : (
                          <Card.Text className="text-danger">一致なし</Card.Text>
                        )}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              ))}
            </>
          ) : (
            <Card.Text>※こちらに表示されます</Card.Text>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};
