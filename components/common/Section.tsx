import { View } from '../Themed';

type Props = {
  children: React.ReactNode;
};

export default function Section({ children }: Props) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 12,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F0EEEC',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      {children}
    </View>
  );
}
