import React from 'react';
import { View, StyleSheet, Linking, Image, Dimensions } from 'react-native';
import { Text, Divider, Icon, Button } from '@ui-kitten/components';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const NewsCard = ({ item }) => {
  const [day, month] = format(parseISO(item.publishedAt), 'dd MMM').split(' ');

  const openUrl = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <View style={styles.newsCard}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text category="h5">{day}</Text>
          <Text style={styles.month}>{month}</Text>
          <Divider style={styles.divider} />
        </View>
        <Button
          onPress={() => openUrl(item.url)}
          appearance="ghost"
          accessoryLeft={<Icon name="external-link-outline" />}
        />
      </View>

      <Text category="h5">{item.title}</Text>
      {item.description[0] !== '<' && (
        <Text category="p1" style={styles.description}>
          {item.description}
        </Text>
      )}

      {item.urlToImage && (
        <Image style={styles.image} source={{ uri: item.urlToImage }} />
      )}
      <Text appearance="hint">Source: {item.source.name || 'No Source'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  newsCard: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#222B45',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
    height: 50,
    justifyContent: 'space-between',
  },
  dateContainer: {
    width: '15%',
  },
  month: { marginBottom: 8 },
  divider: { backgroundColor: 'white' },
  description: { marginTop: 10 },
  image: {
    width: Dimensions.get('window').width - 50,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default NewsCard;
