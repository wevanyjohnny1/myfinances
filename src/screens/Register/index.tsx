import React, { useState } from 'react';
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import { CategorySelect } from '../CategorySelect';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome da movimentação é obrigatório'),
  amount: Yup
    .number()
    .typeError('O valor tem que ser um número')
    .positive('O valor não pode ser negativo')
    .required('O valor da movimentação é obrigatório')
})

export function Register() {
  // alterar o estado do botão
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelect(type: 'up' | 'down') {
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  function handleRegister(form: FormData) {
    if (!transactionType) {
      return Alert.alert('Selecione o tipo da transação');
    }

    if (category.key === 'category') {
      return Alert.alert('Selecione a categoria');
    }

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }

    console.log(data);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastrar</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Movimentação"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              name="amount"
              control={control}
              placeholder="Valor"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
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

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
