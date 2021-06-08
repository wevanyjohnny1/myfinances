import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

} from './styles';

import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';

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
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const theme = useTheme();

  async function loadData() {
    const dataKey = '@myfinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const formatedResponse = response ? JSON.parse(response) : [];

    const costs = formatedResponse
      .filter((cost: TransactionData) => cost.type === 'negative');

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
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <Container>
      <Header>
        <Title>Despesas por categoria</Title>
      </Header>

      <MonthSelect>
        <MonthSelectButton>
          <MonthSelectIcon name="chevron-left" />
        </MonthSelectButton>

        <Month>Junho</Month>

        <MonthSelectButton>
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
    </Container>
  )
}
