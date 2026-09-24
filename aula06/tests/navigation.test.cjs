const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('arquitetura: rotas, telas e tipos estão separados', () => {
  for (const relative of [
    'App.tsx',
    'src/routes/RootNavigator.tsx',
    'src/routes/AppTabs.tsx',
    'src/screens/FeedScreen.tsx',
    'src/screens/ProfileScreen.tsx',
    'src/screens/ProductDetailsScreen.tsx',
    'src/types/navigation.ts',
  ]) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, `arquivo ausente: ${relative}`);
  }

  assert.match(read('App.tsx'), /SafeAreaProvider/);
  assert.match(read('src/routes/RootNavigator.tsx'), /NavigationContainer/);
  assert.match(read('src/routes/RootNavigator.tsx'), /createNativeStackNavigator/);
  assert.match(read('src/routes/RootNavigator.tsx'), /DetalhesProduto/);
  assert.match(read('src/routes/AppTabs.tsx'), /createBottomTabNavigator/);
  assert.match(read('src/routes/AppTabs.tsx'), /name="Feed"/);
  assert.match(read('src/routes/AppTabs.tsx'), /name="Perfil"/);
  assert.match(read('src/screens/FeedScreen.tsx'), /navigate\('DetalhesProduto'/);
  assert.match(read('src/screens/ProductDetailsScreen.tsx'), /route\.params/);
  assert.match(read('src/screens/ProductDetailsScreen.tsx'), /navigation\.goBack/);
  assert.match(read('src/screens/ProductDetailsScreen.tsx'), /navigation\.popToTop/);
  assert.match(read('src/types/navigation.ts'), /itemId: number/);
  assert.match(read('src/types/navigation.ts'), /nomeProduto: string/);
});
