const Tea = require('../models/Tea');

exports.home = async (req, res, next) => {
  try {
    const teas = await Tea.find({ featured: true }).limit(3).lean();
    res.render('home', { title: 'Тёплый лист — чай с характером', teas });
  } catch (error) { next(error); }
};

exports.catalog = async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const [teas, categories] = await Promise.all([
      Tea.find(filter).sort({ createdAt: -1 }).lean(),
      Tea.distinct('category')
    ]);
    res.render('catalog', { title: 'Каталог чая', teas, categories, selectedCategory: req.query.category || '' });
  } catch (error) { next(error); }
};

exports.details = async (req, res, next) => {
  try {
    const tea = await Tea.findOne({ slug: req.params.slug }).lean();
    if (!tea) return res.status(404).render('404', { title: 'Чай не найден' });
    res.render('tea', { title: tea.name, tea });
  } catch (error) { next(error); }
};
