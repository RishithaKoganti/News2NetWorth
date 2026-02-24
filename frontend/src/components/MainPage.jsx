import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

function MainPage() {
  const [inputText, setInputText] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate ML model prediction (replace with actual API call)
    setTimeout(() => {
      // This is where you would call your ML model API
      // For now, we'll simulate a random prediction
      const mockPrediction = {
        result: (Math.random() * 1000000).toFixed(2),
        confidence: (Math.random() * 100).toFixed(2) + '%'
      };
      
      setPrediction(mockPrediction);
      setLoading(false);
    }, 1500);
  };

  return (
    <Container className="main-container">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Net Worth Predictor</h2>
              <p className="text-center text-light mb-4">
                Enter your information below to get your predicted net worth
              </p>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Enter your details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter your financial information, goals, or any relevant data..."
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Submit for Prediction'}
                </Button>
              </Form>

              {prediction && (
                <div className="prediction-box">
                  <h3 className="mb-3">Prediction Result</h3>
                  <p className="prediction-result">
                    ${prediction.result}
                  </p>
                  <p className="text-light">
                    Confidence: {prediction.confidence}
                  </p>
                  <p className="text-muted small">
                    This is a simulated prediction. Connect your ML model for actual results.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default MainPage;