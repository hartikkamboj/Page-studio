module.exports = function (migration) {
  // 1. Create the Section model
  const section = migration
    .createContentType('section')
    .name('Section')
    .description('A UI section block for a page')
    .displayField('sectionId');

  section
    .createField('sectionId')
    .name('Section ID')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }]);

  section
    .createField('type')
    .name('Type')
    .type('Symbol')
    .required(true)
    .validations([
      {
        in: ['hero', 'featureGrid', 'testimonial', 'cta'],
      },
    ]);

  section
    .createField('props')
    .name('Props')
    .type('Object')
    .required(true);

  // 2. Create the Page model
  const page = migration
    .createContentType('page')
    .name('Page')
    .description('A landing page composed of sections')
    .displayField('title');

  page
    .createField('pageId')
    .name('Page ID')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField('title')
    .name('Title')
    .type('Symbol')
    .required(true);

  page
    .createField('slug')
    .name('Slug')
    .type('Symbol')
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField('sections')
    .name('Sections')
    .type('Array')
    .items({
      type: 'Link',
      linkType: 'Entry',
      validations: [{ linkContentType: ['section'] }],
    });
};
