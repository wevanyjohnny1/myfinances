import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { VictoryPie } from 'victory-native';

import { HistoryCard } from '../../components/HistoryCard';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer
} from './styles';

import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';

interface TransactionData {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  name: string;
  total: number;
  formatedTotal: string;
  color: string;
  formatedPercent: string;
  percent: number;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date);
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();
  const { user } = useAuth();

  function handleDateChange(action: 'next' | 'prev') {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1));
    } else {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  async function loadData() {
    setIsLoading(true);
    const dataKey = `@myfinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const formatedResponse = response ? JSON.parse(response) : [];

    const costs = formatedResponse
      .filter((cost: TransactionData) =>
        cost.type === 'negative' &&
        new Date(cost.date).getMonth() === selectedDate.getMonth() &&
        new Date(cost.date).getFullYear() === selectedDate.getFullYear()
      );

    const costsTotal = costs
      .reduce((accumulator: number, cost: TransactionData) => {
        return accumulator + Number(cost.amount);
      }, 0)

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      costs.forEach((cost: TransactionData) => {
        if (cost.category === category.key) {
          categorySum += Number(cost.amount);
        }
      });

      const percent = (categorySum / costsTotal * 100);
      const formatedPercent = `${percent.toFixed(0)}%`

      if (categorySum > 0) {
        const formatedTotal = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          formatedTotal,
          color: category.color,
          percent,
          formatedPercent
        });
      }
    });

    setTotalByCategories(totalByCategory);

    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]))

  return (
    <Container>

      <Header>
        <Title>Despesas por categoria</Title>
      </Header>
      {
        isLoading ?
          <LoadContainer>
            <ActivityIndicator
              color={theme.colors.primary}
              size="large"
            />
          </LoadContainer> :
          <>
            <MonthSelect>
              <MonthSelectButton onPress={() => handleDateChange('prev')} >
                <MonthSelectIcon name="chevron-left" />
              </MonthSelectButton>

              <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

              <MonthSelectButton onPress={() => handleDateChange('next')}>
                <MonthSelectIcon name="chevron-right" />
              </MonthSelectButton>
            </MonthSelect>
            <ChartContainer>
              <VictoryPie
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontFamily: theme.fonts.bold,
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={50}
                x="formatedPercent"
                y="total"
              />
            </ChartContainer>
            <Content
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: useBottomTabBarHeight(),
              }}
            >
              {
                totalByCategories.map(item => (
                  <HistoryCard
                    key={item.key}
                    title={item.name}
                    amount={item.formatedTotal}
                    color={item.color}
                  />
                ))
              }
            </Content>
          </>
      }
    </Container>
  )
}
