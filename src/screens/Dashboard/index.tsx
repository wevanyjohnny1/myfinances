import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useCallback, version } from 'react';

import { ThemeProvider, useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGretting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogoutButton,
  LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  costs: HighlightProps;
  total: HighlightProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[], type: 'positive' | 'negative') {

    const filtteredCollection = collection
      .filter(transaction => transaction.type === type);

    if (filtteredCollection.length === 0)
      return 0;

    const lastTransaction = new Date(
      Math.max.apply(Math, filtteredCollection
        .map(transaction => new Date(transaction.date).getTime())))

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
  }

  useEffect(() => {
    const currentHour = new Date().getHours();

    currentHour < 12 ? setGreeting('Bom dia')
      : currentHour >= 12 && currentHour < 18 ? setGreeting('Boa tarde') : setGreeting('Boa noite')
  }, []);


  async function loadTransactions() {
    const dataKey = `@myfinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactionsLoaded = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let costsTotal = 0;

    const formatedTransactions: DataListProps[] = transactionsLoaded
      .map((item: DataListProps) => {

        if (item.type === 'positive') {
          entriesTotal += Number(item.amount);
        } else {
          costsTotal += Number(item.amount);
        };

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        const date = Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date
        }
      });

    setTransactions(formatedTransactions);

    const lastTransactionEntries = getLastTransactionDate(transactionsLoaded, 'positive');

    const lastTransactionCosts = getLastTransactionDate(transactionsLoaded, 'negative');

    const totalInterval = lastTransactionCosts === 0
      ? 'N??o h?? transa????es'
      : `Per??odo de 01 a ${lastTransactionCosts}`;

    const total = entriesTotal - costsTotal;

    setHighlightData({
      entries: {
        total: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0
          ? 'N??o h?? transa????es'
          : `??ltima entrada dia ${lastTransactionEntries}`,
      },
      costs: {
        total: costsTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionCosts === 0
          ? 'N??o h?? transa????es'
          : `??ltima sa??da dia ${lastTransactionCosts}`,
      },
      total: {
        total: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `${totalInterval}`,
      }
    })

    setIsLoading(false)
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []))

  return (
    <Container>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadContainer> :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo source={{ uri: user.photo }} />
                  <User>
                    <UserGretting>{greeting},</UserGretting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>
                <LogoutButton onPress={signOut}>
                  <Icon name='power' />
                </LogoutButton>
              </UserWrapper>
            </Header>
            <HighlightCards>
              <HighlightCard
                type="up"
                title="Entradas"
                amount={highlightData.entries.total}
                lastTransaction={highlightData.entries.lastTransaction}
              />
              <HighlightCard
                type="down"
                title="Sa??das"
                amount={highlightData.costs.total}
                lastTransaction={highlightData.costs.lastTransaction}
              />
              <HighlightCard
                type="total"
                title="Total"
                amount={highlightData.total.total}
                lastTransaction={highlightData.total.lastTransaction}
              />
            </HighlightCards>

            <Transactions>
              <Title>Movimenta????es</Title>

              <TransactionsList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <TransactionCard data={item} />}
              />
            </Transactions>
          </>
      }
    </Container>
  )
}
