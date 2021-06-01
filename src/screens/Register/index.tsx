import React, { useState } from 'react';
import { Modal } from 'react-native';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Input } from '../../components/Form/Input';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
 } from './styles';

export function Register(){
  // alterar o estado do botão
  const [transactionType, setTransactionType] = useState('');

  function handleTransactionTypeSelect(type: 'up' | 'down'){
    setTransactionType(type);
  }

  return (
    <Container>
      <Header>
        <Title>Cadastrar</Title>
      </Header>

      <Form>
        <Fields>
          <Input 
            placeholder="Movimentação"
          />

          <Input 
            placeholder="Valor"
          />

          <TransactionsTypes>
            <TransactionTypeButton 
              title="Entrada"
              type="up"
              // arrow function porque passa uma prop
              onPress={() => handleTransactionTypeSelect('up')}
              // retorna true or false (o boolean foi criado na interface do componente)
              isActive={transactionType === 'up'}
              
            />
            <TransactionTypeButton 
              title="Saída"
              type="down"
              onPress={() => handleTransactionTypeSelect('down')}
              isActive={transactionType === 'down'}
            />
          </TransactionsTypes>

          <CategorySelectButton title="Categoria"/>
        </Fields>

        <Button title="Enviar" />
      </Form>
    </Container>
  )
}