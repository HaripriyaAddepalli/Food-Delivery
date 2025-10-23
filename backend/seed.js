import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "./models/userModel.js";
import Restaurant from "./models/Restaurant.js";
import Food from "./models/foodModel.js";
import Order from "./models/orderModel.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const users = [
  { name: "Alice", email: "alice@example.com", password: "alice123", role: "user" },
  { name: "Bob", email: "bob@example.com", password: "bob123", role: "user" },
  { name: "Charlie", email: "charlie@example.com", password: "charlie123", role: "user" },
  { name: "Diana", email: "diana@example.com", password: "diana123", role: "user" },
  { name: "Eve", email: "eve@example.com", password: "eve123", role: "user" },
  { name: "Admin", email: "admin@example.com", password: "admin123", role: "admin" }
];

const restaurants = [
  { name: "Pizza Hub", address: "123 Main Street", phone: "1111111111" },
  { name: "Burger House", address: "456 Market Road", phone: "2222222222" }
];

const foods = [
  { name: "Margherita Pizza", description: "Cheese + Tomato + Basil", price: 250, category: "Pizza", restaurantName: "Pizza Hub", image: "1722865444288food_1.png" },
  { name: "Pepperoni Pizza", description: "Cheese + Pepperoni", price: 300, category: "Pizza", restaurantName: "Pizza Hub", image: "1722865514626food_2.png" },
  { name: "BBQ Chicken Pizza", description: "Chicken + BBQ Sauce + Cheese", price: 350, category: "Pizza", restaurantName: "Pizza Hub", image: "1722865628915food_3.png" },
  { name: "Veggie Supreme Pizza", description: "Mixed Vegetables + Cheese", price: 280, category: "Pizza", restaurantName: "Pizza Hub", image: "1722865668073food_4.png" },
  { name: "Hawaiian Pizza", description: "Ham + Pineapple + Cheese", price: 320, category: "Pizza", restaurantName: "Pizza Hub", image: "1722865738489food_5.png" },
  { name: "Cheeseburger", description: "Beef + Cheese + Lettuce", price: 150, category: "Burger", restaurantName: "Burger House", image: "1722865934153food_6.png" },
  { name: "Veggie Burger", description: "Veg Patty + Lettuce + Tomato", price: 120, category: "Burger", restaurantName: "Burger House", image: "1722865976487food_7.png" },
  { name: "Chicken Burger", description: "Chicken Patty + Mayo + Lettuce", price: 180, category: "Burger", restaurantName: "Burger House", image: "1722866043779food_8.png" },
  { name: "Fish Burger", description: "Fish Fillet + Tartar Sauce", price: 200, category: "Burger", restaurantName: "Burger House", image: "1722866109947food_9.png" },
  { name: "Bacon Burger", description: "Beef + Bacon + Cheese", price: 220, category: "Burger", restaurantName: "Burger House", image: "1722866148130food_10.png" }
];

async function seedDB() {
  try {
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Food.deleteMany({});
    await Order.deleteMany({});

    for (let user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
      await User.create(user);
    }
    console.log("Users added");

    const createdRestaurants = [];
    for (let res of restaurants) {
      const r = await Restaurant.create(res);
      createdRestaurants.push(r);
    }
    console.log("Restaurants added");

    const createdFoods = [];
    for (let f of foods) {
      const restaurant = createdRestaurants.find(r => r.name === f.restaurantName);
      if (restaurant) {
        const foodData = { ...f, restaurantId: restaurant._id };
        delete foodData.restaurantName;
        const foodItem = await Food.create(foodData);
        createdFoods.push(foodItem);
      }
    }
    console.log("Foods added");

    // Create multiple orders
    const alice = await User.findOne({ email: "alice@example.com" });
    const bob = await User.findOne({ email: "bob@example.com" });
    const charlie = await User.findOne({ email: "charlie@example.com" });
    const diana = await User.findOne({ email: "diana@example.com" });
    const eve = await User.findOne({ email: "eve@example.com" });

    if (alice) {
      await Order.create({
        userId: alice._id,
        restaurantId: createdRestaurants[0]._id,
        items: [
          { foodId: createdFoods[0]._id, quantity: 2, price: createdFoods[0].price },
          { foodId: createdFoods[1]._id, quantity: 1, price: createdFoods[1].price }
        ],
        totalAmount: (createdFoods[0].price * 2) + createdFoods[1].price,
        status: "Pending"
      });
    }

    if (bob) {
      await Order.create({
        userId: bob._id,
        restaurantId: createdRestaurants[1]._id,
        items: [
          { foodId: createdFoods[5]._id, quantity: 1, price: createdFoods[5].price },
          { foodId: createdFoods[6]._id, quantity: 1, price: createdFoods[6].price }
        ],
        totalAmount: createdFoods[5].price + createdFoods[6].price,
        status: "Delivered"
      });
    }

    if (charlie) {
      await Order.create({
        userId: charlie._id,
        restaurantId: createdRestaurants[0]._id,
        items: [
          { foodId: createdFoods[2]._id, quantity: 1, price: createdFoods[2].price },
          { foodId: createdFoods[3]._id, quantity: 1, price: createdFoods[3].price }
        ],
        totalAmount: createdFoods[2].price + createdFoods[3].price,
        status: "In Progress"
      });
    }

    if (diana) {
      await Order.create({
        userId: diana._id,
        restaurantId: createdRestaurants[1]._id,
        items: [
          { foodId: createdFoods[7]._id, quantity: 2, price: createdFoods[7].price },
          { foodId: createdFoods[8]._id, quantity: 1, price: createdFoods[8].price }
        ],
        totalAmount: (createdFoods[7].price * 2) + createdFoods[8].price,
        status: "Pending"
      });
    }

    if (eve) {
      await Order.create({
        userId: eve._id,
        restaurantId: createdRestaurants[0]._id,
        items: [
          { foodId: createdFoods[4]._id, quantity: 1, price: createdFoods[4].price },
          { foodId: createdFoods[9]._id, quantity: 1, price: createdFoods[9].price }
        ],
        totalAmount: createdFoods[4].price + createdFoods[9].price,
        status: "Cancelled"
      });
    }

    console.log("Sample orders added");

    console.log("Database seeding completed!");
    mongoose.disconnect();
  } catch (err) {
    console.log(err);
    mongoose.disconnect();
  }
}

seedDB();
