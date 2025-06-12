'use client';

import styled from 'styled-components';

const Button = styled.button`
  display: block;
  margin: 2rem auto;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  background: #e50914;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f40612;
  }

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }
`;

export default function RandomButton({ onSelect, disabled }) {
  return (
    <Button onClick={onSelect} disabled={disabled}>
      Pick a Random Movie
    </Button>
  );
} 