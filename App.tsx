import { StatusBar } from "expo-status-bar";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import React, { useEffect } from "react";

const { width } = Dimensions.get("window");

const cardList = [
  {
    icon: <Feather name="more-horizontal" color="white" size={24} />,
    title: "HEADER",
    bgColor: "#404040",
  },
  {
    icon: <AntDesign name="barschart" size={24} color="white" />,
    title: "CHARTS",
    bgColor: "#484848",
  },
  {
    icon: <Foundation name="book" size={24} color="white" />,
    title: "BOOK",
    bgColor: "#505050",
  },
  {
    icon: <Ionicons name="ios-calendar" size={24} color="white" />,
    title: "CALENDAR",
    bgColor: "#585858",
  },
  {
    icon: <AntDesign name="camera" size={24} color="white" />,
    title: "CAMERA",
    bgColor: "#606060",
  },
];
interface CardProps {
  name: string;
  icon: JSX.Element;
  firstItemOnTop?: boolean;
  index: number;
  progress: Animated.SharedValue<number>;
  offset: number;
  gap: number;
  toggle: () => void;
  bgColor?: string;
  expanded?: boolean;
}

const Card = ({
  name,
  icon,
  firstItemOnTop,
  index,
  progress,
  offset,
  gap,
  toggle,
  bgColor,
  expanded,
}: CardProps): JSX.Element => {
  const rStyle = useAnimatedStyle(() => {
    return {
      zIndex: firstItemOnTop ? index : -index,
      transform: [
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [(offset - 50) * index, gap * index]
          ),
        },
      ],
      width: interpolate(
        progress.value,
        [1, 0],
        [width - 60, width - 60 - 20 * index]
      ),
      alignSelf: "center",
    };
  });

  return (
    <Animated.View style={rStyle}>
      <Pressable onPress={firstItemOnTop ? toggle : () => {}}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: expanded ? "rgb(53, 57, 53)" : bgColor,
            },
          ]}
        >
          {expanded && (
            <View style={styles.spacedRow}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>{icon}</View>

                <Text style={styles.title}>{name}</Text>
              </View>

              <Entypo name="chevron-right" size={24} color="white" />
            </View>
          )}
          {!expanded && firstItemOnTop && (
            <View style={styles.spacedRow}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>{icon}</View>

                <Text style={styles.title}>{name}</Text>
              </View>

              <Entypo name="chevron-right" size={24} color="white" />
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default function App() {
  const [expanded, setExpanded] = React.useState(false);

  const progress = useSharedValue(0);

  useEffect(() => {
    if (expanded) {
      progress.value = withSpring(1);
    } else {
      progress.value = withSpring(0);
    }
  }, [expanded]);

  const gap = 10;
  const offset = -30;

  const childrenCount = cardList.length;

  const rStyle = useAnimatedStyle(() => {
    return {
      marginBottom: interpolate(
        progress.value,
        [0, 1],
        [(offset - 50) * (childrenCount - 1), gap * (childrenCount - 1)]
      ),
      width: "100%",
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Animated.View style={rStyle}>
        {cardList.map((card, index) => {
          return (
            <Card
              index={index}
              progress={progress}
              offset={offset}
              gap={gap}
              key={index}
              firstItemOnTop={index === 0}
              name={card?.title}
              icon={card.icon}
              toggle={() => setExpanded(!expanded)}
              expanded={expanded}
              bgColor={card.bgColor}
            />
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  card: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 6.84,
    elevation: 5,
    height: 68,
  },
  iconWrap: {
    padding: 7,
    backgroundColor: "#000",
    borderRadius: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "normal",
    color: "white",
    marginLeft: 10,
  },
  spacedRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
});
