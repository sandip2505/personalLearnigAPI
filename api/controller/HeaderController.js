const header = require('../model/Header');

const HeaderController = {};

HeaderController.getHeader = async (req, res) => {
  try {
    const headers = await header.find();
    res.status(200).json(headers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching header', error });
  }
}

HeaderController.activeHeader = async (req, res) => {
  try {
    const headers = await header.findOne({ visible: true });
    res.status(200).json(headers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching header', error });
  }
}


HeaderController.createHeader = async (req, res) => {
  try {
    const body = req.body;

    const visible = body.visible === 'on';
    const headerlogo = body.headerlogo || null;
    const name = body.name || '';

    // --- Parse CTA ---
    const parsedCTA = {
      infoText: body['cta[text]'] || '',
      link: body['cta[link]'] || '',
      visible: body['cta[visible]'] === 'on'
    };

    // --- Parse Menu and Submenu ---
    const menu = [];
    let index = 0;

    while (body[`menu[${index}][name]`]) {
      const menuItem = {
        name: body[`menu[${index}][name]`] || '',
        link: body[`menu[${index}][link]`] || '',
        visible: body[`menu[${index}][visible]`] === 'on',
        submenu: []
      };

      let subIndex = 0;
      while (body[`menu[${index}][submenu][${subIndex}][name]`]) {
        const subItem = {
          name: body[`menu[${index}][submenu][${subIndex}][name]`] || '',
          link: body[`menu[${index}][submenu][${subIndex}][link]`] || '',
          visible: body[`menu[${index}][submenu][${subIndex}][visible]`] === 'on'
        };
        menuItem.submenu.push(subItem);
        subIndex++;
      }

      menu.push(menuItem);
      index++;
    }

    const headerData = {
      name,
      headerlogo,
      visible,
      menu,
      cta: parsedCTA
    };

    console.log("Parsed Header Data:", headerData);

    const newHeader = new header(headerData); 
    await newHeader.save();

    res.status(201).json(newHeader);
  } catch (error) {
    console.error('Error creating header:', error);
    res.status(500).json({ message: 'Error creating header', error });
  }
};


HeaderController.addHeader = async (req, res) => {
  try {
    const newHeader = new header(req.body);
    await newHeader.save();
    res.status(201).json(newHeader);
  } catch (error) {
    res.status(500).json({ message: 'Error adding header', error });
  }
};

HeaderController.editHeader = async (req, res) => {
  try {
    const updatedHeader = await header.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedHeader);
  } catch (error) {
    res.status(500).json({ message: 'Error editing header', error });
  }
};

HeaderController.updateHeader = async (req, res) => {
  console.log("API call to update header");
  try {
    const body = req.body;

    const visible = body.visible === 'on';
    const headerlogo = body.headerlogo || null;
    const name = body.name || '';

    // --- Parse CTA ---
    const parsedCTA = {
      infoText: body['cta[text]'] || '',
      link: body['cta[link]'] || '',
      visible: body['cta[visible]'] === 'on'
    };

    // --- Parse Menu and Submenu ---
    const menu = [];
    let index = 0;

    while (body[`menu[${index}][name]`]) {
      const menuItem = {
        name: body[`menu[${index}][name]`] || '',
        link: body[`menu[${index}][link]`] || '',
        visible: body[`menu[${index}][visible]`] === 'on',
        submenu: []
      };

      let subIndex = 0;
      while (body[`menu[${index}][submenu][${subIndex}][name]`]) {
        const subItem = {
          name: body[`menu[${index}][submenu][${subIndex}][name]`] || '',
          link: body[`menu[${index}][submenu][${subIndex}][link]`] || '',
          visible: body[`menu[${index}][submenu][${subIndex}][visible]`] === 'on'
        };
        menuItem.submenu.push(subItem);
        subIndex++;
      }

      menu.push(menuItem);
      index++;
    }

    const headerData = {
      name,
      headerlogo,
      visible,
      menu,
      cta: parsedCTA
    };

    console.log("Parsed Updated Header Data:", headerData);

    const updatedHeader = await header.findByIdAndUpdate(
      req.params.id,
      headerData,
      { new: true }
    );

    res.status(200).json(updatedHeader);
  } catch (error) {
    console.error('Error updating header:', error);
    res.status(500).json({ message: 'Error updating header', error });
  }
};


module.exports = HeaderController;
