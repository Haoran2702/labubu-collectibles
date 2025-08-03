const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const unsplashImages = [
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=400&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=400&fit=crop&crop=center',
];

async function updateRenderDatabase() {
  const dbPath = '/tmp/database.sqlite';
  console.log('Connecting to database at:', dbPath);
  
  const db = new sqlite3.Database(dbPath);
  
  return new Promise((resolve, reject) => {
    db.all('SELECT id FROM products', (err, products) => {
      if (err) {
        console.error('Error fetching products:', err);
        db.close();
        reject(err);
        return;
      }
      
      console.log(`Found ${products.length} products to update`);
      
      let updated = 0;
      products.forEach((product, index) => {
        const imageUrl = unsplashImages[index % unsplashImages.length];
        
        db.run('UPDATE products SET imageUrl = ? WHERE id = ?', [imageUrl, product.id], (err) => {
          if (err) {
            console.error(`Error updating product ${product.id}:`, err);
          } else {
            updated++;
            console.log(`Updated product ${product.id} with image: ${imageUrl}`);
          }
          
          if (updated === products.length) {
            console.log('All products updated successfully!');
            db.close();
            resolve();
          }
        });
      });
    });
  });
}

updateRenderDatabase().catch(console.error); 