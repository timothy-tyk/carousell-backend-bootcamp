const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  // Create listing. Requires authentication.
  async insertOne(req, res) {
    const {
      title,
      category,
      condition,
      price,
      description,
      shippingDetails,
      sellerEmail,
    } = req.body;
    try {
      // TODO: Get seller email from auth, query Users table for seller ID
      console.log(sellerEmail);
      const [user, created] = await this.userModel.findOrCreate({
        where: { email: sellerEmail },
      });
      if (created) {
        console.log(user);
      }
      // Create new listing
      const newListing = await this.model.create({
        title: title,
        category: category,
        condition: condition,
        price: price,
        description: description,
        shippingDetails: shippingDetails,
        buyerId: null,
        sellerId: user.id, // TODO: Replace with seller ID of authenticated seller
      });

      // Respond with new listing
      return res.json(newListing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve specific listing. No authentication required.
  async getOne(req, res) {
    const { listingId } = req.params;
    try {
      const output = await this.model.findByPk(listingId);
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Buy specific listing. Requires authentication.
  async buyItem(req, res) {
    const { listingId } = req.params;
    // TODO: Get buyer email from auth, query Users table for buyer ID
    try {
      const data = await this.model.findByPk(listingId);
      const { buyerEmail } = req.body;
      const [user, created] = await this.userModel.findOrCreate({
        where: { email: buyerEmail },
      });
      await created;
      console.log("user", user);
      await data.update({ buyerId: user.id });

      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      console.log("err", err.response);
      return res.status(400).json({ error: true, msg: err });
    }
  }
  // Buy specific listing. Requires authentication.
  // async buyItem(req, res) {
  //   const { listingId } = req.params;
  //   const { buyerEmail } = req.body;
  //   try {
  //     const data = await this.model.findByPk(listingId);

  //     let buyer;

  //     const [user, created] = await this.userModel.findOrCreate({
  //       where: { email: buyerEmail },
  //     });

  //     if (created) {
  //       buyer = user.id;
  //     } else {
  //       buyer = user.id;
  //     }
  //     // TODO: Get buyer email from auth, query Users table for buyer ID
  //     await data.update({ buyerId: buyer }); // TODO: Replace with buyer ID of authenticated buyer

  //     // Respond to acknowledge update
  //     return res.json(data);
  //   } catch (err) {
  //     return res.status(400).json({ error: true, msg: err });
  //   }
  // }
}

module.exports = ListingsController;
