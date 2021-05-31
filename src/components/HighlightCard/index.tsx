import React from 'react';

import { 
  Container,
  Header,
  Title,
  Icon,
  Footer,
  Amount,
  LastTransaction
 } from './styles';

 interface props {
   title: string;
   amount: string;
   lastTransaction: string;
   type: 'up' | 'down' | 'total'
 }

 const icon = {
   up: 'arrow-up-circle',
   down: 'arrow-down-circle',
   total: 'dollar-sign'
 }

export function HighlightCard({ title, amount, lastTransaction, type } : props){
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        {/* type recebe a propriedade no styled-components */}
        {/* a const icon recebe o type da interface */}
        <Icon name={icon[type]} type={type} />
      </Header>

      <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransaction type={type}>{lastTransaction}</LastTransaction>
      </Footer>
    </Container>
  )
}