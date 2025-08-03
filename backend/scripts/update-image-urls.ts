import { openDb } from '../db';

const unsplashImages = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop&crop=center',
];

async function updateImageUrls() {
  const db = await openDb();
  const products = await db.all('SELECT id FROM products');
  for (let i = 0; i < products.length; i++) {
    const imageUrl = unsplashImages[i % unsplashImages.length];
    await db.run('UPDATE products SET imageUrl = ? WHERE id = ?', imageUrl, products[i].id);
  }
  await db.close();
  console.log('All product image URLs updated to Unsplash demo links.');
}

updateImageUrls().catch(console.error);