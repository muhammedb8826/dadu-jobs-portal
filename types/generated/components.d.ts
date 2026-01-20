import type { Schema, Struct } from '@strapi/strapi';

export interface CommonCard extends Struct.ComponentSchema {
  collectionName: 'components_common_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    description: Schema.Attribute.String;
    icon: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<
        'plugin::strapi-plugin-iconhub.iconhub',
        {
          storeIconData: true;
          storeIconName: true;
        }
      >;
    title: Schema.Attribute.String;
  };
}

export interface CommonLinkWithIcon extends Struct.ComponentSchema {
  collectionName: 'components_common_link_with_icons';
  info: {
    displayName: 'Link with Icon';
  };
  attributes: {
    icon: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<
        'plugin::strapi-plugin-iconhub.iconhub',
        {
          storeIconData: true;
          storeIconName: true;
        }
      >;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface CommonSocialIcon extends Struct.ComponentSchema {
  collectionName: 'components_common_social_icons';
  info: {
    displayName: 'Social Icon';
  };
  attributes: {
    icon: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<
        'plugin::strapi-plugin-iconhub.iconhub',
        {
          storeIconData: true;
          storeIconName: true;
        }
      >;
    url: Schema.Attribute.String;
  };
}

export interface ComponentsForCandidates extends Struct.ComponentSchema {
  collectionName: 'components_components_for_candidates_s';
  info: {
    displayName: 'For Candidates ';
  };
  attributes: {
    cards: Schema.Attribute.Component<'common.card', true>;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsForEmployers extends Struct.ComponentSchema {
  collectionName: 'components_components_for_employers';
  info: {
    displayName: 'For Employers';
  };
  attributes: {
    cards: Schema.Attribute.Component<'common.card', true>;
    title: Schema.Attribute.String;
  };
}

export interface ComponentsHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_components_hero_sections';
  info: {
    displayName: 'Hero Section';
  };
  attributes: {
    button: Schema.Attribute.Component<'components.link', true>;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    subHeading: Schema.Attribute.String;
  };
}

export interface ComponentsHowItWorks extends Struct.ComponentSchema {
  collectionName: 'components_components_how_it_works';
  info: {
    displayName: 'How it works';
  };
  attributes: {
    forCandidates: Schema.Attribute.Component<
      'components.for-candidates',
      false
    >;
    forEmployers: Schema.Attribute.Component<'components.for-employers', false>;
    heading: Schema.Attribute.String;
    subHeading: Schema.Attribute.String;
  };
}

export interface ComponentsLink extends Struct.ComponentSchema {
  collectionName: 'components_components_links';
  info: {
    displayName: 'Link';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface LayoutAboutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_about_footer_s';
  info: {
    displayName: 'About(footer)';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface LayoutContactFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_contact_footer_s';
  info: {
    displayName: 'Contact(Footer)';
  };
  attributes: {
    address: Schema.Attribute.String;
    link: Schema.Attribute.Component<'common.link-with-icon', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutFollowUs extends Struct.ComponentSchema {
  collectionName: 'components_layout_follow_uses';
  info: {
    displayName: 'Follow Us';
  };
  attributes: {
    socialLinks: Schema.Attribute.Component<'common.social-icon', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    about: Schema.Attribute.Component<'layout.about-footer', false>;
    contactInformation: Schema.Attribute.Component<
      'layout.contact-footer',
      false
    >;
    copyRight: Schema.Attribute.String;
    followUs: Schema.Attribute.Component<'layout.follow-us', false>;
    quickLinks: Schema.Attribute.Component<'layout.quick-links-about', false>;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    displayName: 'Header';
  };
  attributes: {
    button: Schema.Attribute.Component<'components.link', true>;
    logo: Schema.Attribute.Media<'images'>;
    menu: Schema.Attribute.Component<'components.link', true>;
  };
}

export interface LayoutQuickLinksAbout extends Struct.ComponentSchema {
  collectionName: 'components_layout_quick_links_about_s';
  info: {
    displayName: 'Quick Links(About)';
  };
  attributes: {
    link: Schema.Attribute.Component<'components.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutTopHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_top_headers';
  info: {
    displayName: 'Top Header';
  };
  attributes: {
    button: Schema.Attribute.Component<'components.link', true>;
    cta: Schema.Attribute.Component<'common.link-with-icon', true>;
    socialIcon: Schema.Attribute.Component<'common.social-icon', true>;
  };
}

export interface SharedEducation extends Struct.ComponentSchema {
  collectionName: 'components_shared_educations';
  info: {
    displayName: 'Education';
  };
  attributes: {
    degree: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    endDate: Schema.Attribute.Date;
    fieldOfStudy: Schema.Attribute.String;
    institution: Schema.Attribute.String;
    startDate: Schema.Attribute.Date;
  };
}

export interface SharedExperience extends Struct.ComponentSchema {
  collectionName: 'components_shared_experiences';
  info: {
    displayName: 'Experience';
  };
  attributes: {
    companyName: Schema.Attribute.String;
    description: Schema.Attribute.Blocks;
    endDate: Schema.Attribute.Date;
    isCurrent: Schema.Attribute.Boolean;
    jobTitle: Schema.Attribute.String;
    location: Schema.Attribute.String;
    startDate: Schema.Attribute.Date;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSalaryRange extends Struct.ComponentSchema {
  collectionName: 'components_shared_salary_ranges';
  info: {
    displayName: 'Salary Range';
  };
  attributes: {
    currency: Schema.Attribute.Enumeration<['ETB', 'USD', 'EUR']>;
    isNegotiable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    max: Schema.Attribute.Integer;
    min: Schema.Attribute.Integer;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.card': CommonCard;
      'common.link-with-icon': CommonLinkWithIcon;
      'common.social-icon': CommonSocialIcon;
      'components.for-candidates': ComponentsForCandidates;
      'components.for-employers': ComponentsForEmployers;
      'components.hero-section': ComponentsHeroSection;
      'components.how-it-works': ComponentsHowItWorks;
      'components.link': ComponentsLink;
      'layout.about-footer': LayoutAboutFooter;
      'layout.contact-footer': LayoutContactFooter;
      'layout.follow-us': LayoutFollowUs;
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'layout.quick-links-about': LayoutQuickLinksAbout;
      'layout.top-header': LayoutTopHeader;
      'shared.education': SharedEducation;
      'shared.experience': SharedExperience;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.salary-range': SharedSalaryRange;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
