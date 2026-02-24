import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container className="home-container">
      <Row className="justify-content-center">
        <Col md={8} className="quote-section">
          <h1 className="quote-text">
            "Your net worth to the world is usually determined by what remains after your bad habits are subtracted from your good ones."
          </h1>
          <p className="quote-author">— Benjamin Franklin</p>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/signup')}
          >
            Join Us Today
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;