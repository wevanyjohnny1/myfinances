import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HistoryCard } from '../../components/HistoryCard';
import {
  Container,
  Header,
  Title
} from './styles';
import { categories } from '../../utils/categories';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

export function Resume() {

  async function loadData() {
    const dataKey = '@myfinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const formatedResponse = response ? JSON.parse(response) : [];

    const costs = formatedResponse
      .filter((cost: TransactionData) => cost.type === 'negative');

    categories.forEach(category => {
      let categorySum = 0;

      costs.forEach((cost: TransactionData) => {
        if (cost.category === category.key) {
          categorySum += Number(cost.amount);
        }
      })
    })
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <HistoryCard
        title="Compras"
        amount="R$ 150,50"
        color="red"
      />
    </Container>
  )
}
