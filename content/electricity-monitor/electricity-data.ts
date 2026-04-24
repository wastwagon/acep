// Auto-generated electricity monitor data from electricitymonitorgh.com
// Generated at: 2026-01-27T08:03:31.292Z
// DO NOT EDIT MANUALLY - Run: node scripts/scrape-electricity-monitor.mjs

export interface ElectricityPage {
  id: string;
  name: string;
  url: string;
  title?: string;
  statistics?: {
    nationalAccess?: number;
    ruralAccess?: number;
    urbanAccess?: number;
  };
  powerPlants?: string[][];
  content?: {
    html?: string;
    text?: string;
  };
  images?: Array<{
    src: string;
    srcset?: string | null;
    alt: string;
  }>;
  assets?: Array<{
    type: string;
    url: string;
  }>;
}

export const electricityPages: ElectricityPage[] = [
  {
    "id": "access",
    "name": "Access",
    "url": "https://electricitymonitorgh.com/access/",
    "title": "Access – ACEP's Electricity Monitor",
    "statistics": {},
    "powerPlants": [],
    "content": {
      "text": "Access to Electricity in Ghana\n\t\n\t\t\n\t\t\tThe National Electrification Scheme (NES), launched in 1989 to ensure reliable electricity supply across Ghana by 2020, has played a pivotal role in expanding access nationwide and advancing Sustainable Development Goal 7 (SDG 7). At the start of the program in 1990, only about 20% of the population had electricity access. Since then, Ghana has made remarkable progress, maintaining the highest electricity access rate in sub-Saharan Africa.\nAlthough the original target of universal access by 2020 has been extended to 2025, the country continues to make steady gains. As of the end of 2024, national electricity access stood at 89.4%. Based on the projected population of 33,007,618 (Ghana Statistical Service), an estimated 3.5 million Ghanaians still lack access to electricity.\nBreakdown of the population’s electricity access:\n\nNational: 89.4%\nRural: 76.7%\nUrban: 100%\n\n\n\t\t\n\t\nAccessibility Across Regions in Percentages\n\t\n\t\t\n\t\t\t\n\n\n\n\n\n\n\n\n\n\t\t\n\t\nGrid Elect"
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1768953771"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1147669"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/interactive-geo-maps/assets/public/css/styles.min.css?ver=1.6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://cdn.amcharts.com/lib/version/4.10.29/core.js?ver=1.6.9"
      },
      {
        "type": "js",
        "url": "https://cdn.amcharts.com/lib/version/4.10.29/maps.js?ver=1.6.9"
      },
      {
        "type": "js",
        "url": "https://cdn.amcharts.com/lib/version/4.10.29/themes/animated.js?ver=1.6.9"
      },
      {
        "type": "js",
        "url": "https://cdn.amcharts.com/lib/4/geodata/ghanaHigh.js?ver=1.6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/interactive-geo-maps/assets/public/map-service/app.min.js?ver=1.6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_waypoints/vc-waypoints.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/chart-js-dist/chart.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_line_chart/vc_line_chart.min.js?ver=6.8.0"
      }
    ]
  },
  {
    "id": "consumption",
    "name": "Consumption",
    "url": "https://electricitymonitorgh.com/consumption/",
    "title": "Consumption – ACEP's Electricity Monitor",
    "statistics": {},
    "powerPlants": [],
    "content": {
      "text": "Ghana’s electricity consumption has grown significantly over the years, with customers increasing from 932,598 in 2000 to 6,166,430 in 20224 at an annual average growth rate of 8.3%. Residential customers constitute the majority with 86%, while non-residential customers and special load tariff (SLT) customers who are large energy consumers make up 14% and 0.04%, respectively. ECG holds the majority share among distribution entities, with 79.6%, followed by NEDCO (20.4%) and EPC (0.003%).\n\n\t\t\n\t\nElectricity Consumption by Sectors (GWh)\n\n\t\n\t\n\t\t\n\t\n\n\n\t\n\t\t\n\t\t\tThe graph illustrates electricity consumption by sector from 2000 to 2024, showing steady growth in overall demand, with an average annual increase of approximately 4.7%.\nIn 2024, Ghana’s electricity consumption rose to 20,196 GWh. The residential sector led in consumption, with 8,569 GWh, accounting for 42.4% of the total, and continued its steady growth over the past decade. The industrial sector followed closely with 8,159 GWh (40.4%"
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1769445455"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1154221"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_waypoints/vc-waypoints.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/chart-js-dist/chart.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_line_chart/vc_line_chart.min.js?ver=6.8.0"
      }
    ]
  },
  {
    "id": "distribution",
    "name": "Distribution",
    "url": "https://electricitymonitorgh.com/distribution-2/",
    "title": "Distribution – ACEP's Electricity Monitor",
    "statistics": {},
    "powerPlants": [],
    "content": {
      "text": ""
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1769492855"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1154951"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      }
    ]
  },
  {
    "id": "distribution-northern",
    "name": "Distribution - Northern Zone",
    "url": "https://electricitymonitorgh.com/electricity-distribution-in-the-northern-zone/",
    "title": "Electricity Distribution in the Northern Zone – ACEP's Electricity Monitor",
    "statistics": {},
    "powerPlants": [],
    "content": {
      "text": "The Northern Electricity Distribution Company (NEDCo), a wholly owned subsidiary of the Volta River Authority (VRA), oversees electricity distribution in northern Ghana. Its operations span about 64% of Ghana’s geographical area, serving as the sole distributor of electricity in the Upper East, Upper West, North East, Savannah, Northern, Bono, Bono East, Ahafo, and parts of the Oti, Ashanti, and Western North regions.\nAs of December 2023, NEDCo reported a customer population of 1,202,540, representing approximately 19.5% of the national electricity customer base of 6,166,430 at the end of 2024. (Note: NEDCo’s 2024 customer figures were not publicly available at the time of reporting.)\n\n\t\t\n\t\nGrid Electricity Purchase, Sales and Losses Incurred by NEDCo (GWh)\n\n\t\n\t\n\t\t\n\t\n\n\n\t\n\t\t\n\t\t\t\n\n\nThe losses refer to the difference between the amount of electricity NEDCo buys from GRIDCo and what it manages to sell to its customers. These losses fall into two categories: technical and commercial. Techni"
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1769480528"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1154620"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_waypoints/vc-waypoints.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/chart-js-dist/chart.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_line_chart/vc_line_chart.min.js?ver=6.8.0"
      }
    ]
  },
  {
    "id": "distribution-southern",
    "name": "Distribution - Southern Zone",
    "url": "https://electricitymonitorgh.com/electricity-distribution-in-the-southern-zone/",
    "title": "Electricity Distribution in the Southern Zone – ACEP's Electricity Monitor",
    "statistics": {},
    "powerPlants": [],
    "content": {
      "text": "The distribution of electricity in the southern part of Ghana falls under the jurisdiction of the Electricity Company of Ghana (ECG). This encompasses the Greater Accra, Central, Western, Western North, Volta, Eastern, Ashanti, and Oti regions. Within these regions, ECG serves an extensive customer base, exceeding 4 million customers, making it the largest electricity service provider in Ghana, representing approximately 80% of the total customer count. Furthermore, ECG is responsible for the distribution of 87.8% of the total electricity supplied throughout Ghana.\n\n\t\t\n\t\nGrid Electricity Purchase, Sales and Losses Incurred by ECG (GWh)\n\n\t\n\t\n\t\t\n\t\n\n\n\t\n\t\t\n\t\t\tThe losses refer to the difference between the amount of electricity ECG buys from GRIDCo and what it manages to sell to its customers. These losses fall into two categories: technical and commercial. Technical losses result from inefficiencies in the power grid. Commercial losses occur when customers do not fully pay for the electric"
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1769493190"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1154953"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_waypoints/vc-waypoints.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/chart-js-dist/chart.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_line_chart/vc_line_chart.min.js?ver=6.8.0"
      }
    ]
  },
  {
    "id": "generation",
    "name": "Generation",
    "url": "https://electricitymonitorgh.com/generation/",
    "title": "Generation – ACEP's Electricity Monitor",
    "statistics": {},
    "powerPlants": [],
    "content": {
      "text": "Electricity generation in Ghana has historically relied heavily on hydro and thermal sources. Nevertheless, there has been a deliberate shift towards incorporating more renewable energy sources over the past decade, driven by a desire to diversify the energy mix. Hydropower dominated electricity generation in Ghana from 2000 to 2015, with its share ranging between 51% and 92%. Thermal power has, since 2016, dominated electricity generation, with output steadily increasing and peaking at 14,930 GWh in 2023 before a slight decline to 14,524 GWh in 2024.\n\n\t\t\n\t\nElectricity Generation Trend    \n        \n        \n\n            jQuery(window).on('load', function ($) {\n                var showLegend = false;\n                                showLegend = true;\n                                var ChartData_chart_69734e27cf4e3 = {\"datasets\":[{\"label\":\"Total Electricity Generated (GWh)\",\"fillColor\":\"rgba(30, 115, 190, 0.2)\",\"fill\":true,\"pointBackgroundColor\":\"rgba(30, 115, 190, 1)\",\"pointBorderColor"
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1769164327"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1150714"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/css/frontend.min.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/templates/infowindow/default/default.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/templates/post/acerra/acerra.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/templates/item/fano/fano.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/Chart.min.js?ver=2.9.3"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_waypoints/vc-waypoints.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/chart-js-dist/chart.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_line_chart/vc_line_chart.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://maps.google.com/maps/api/js?key=AIzaSyCzebkf8UL4m1bkPa9l944AoBAedATt0wI&libraries=geometry%2Cplaces%2Cweather%2Cpanoramio%2Cdrawing&language=en&ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/imagesloaded.min.js?ver=5.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/masonry.min.js?ver=4.2.2"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.masonry.min.js?ver=3.1.2b"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/maps.min.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/frontend.min.js?ver=5.3.1"
      }
    ]
  },
  {
    "id": "home",
    "name": "Home",
    "url": "https://electricitymonitorgh.com/",
    "title": "ACEP's Electricity Monitor – Electricity Monitor – Ghana",
    "statistics": {
      "nationalAccess": 89.4,
      "ruralAccess": 76.7,
      "urbanAccess": 100
    },
    "powerPlants": [
      [
        "wdt_ID",
        "Power Stations",
        "Location",
        "Type",
        "Installed Capacity (MW)",
        "Dependable Capacity (MW)",
        "Additional Description"
      ],
      [
        "1",
        "Hydroelectric Power Stations",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "2",
        "Akosombo Hydroelectric Power Station",
        "Akosombo (Eastern Region)",
        "Hydro Power Plant",
        "1,020",
        "900",
        ""
      ],
      [
        "3",
        "Kpong Hydroelectric Power Station",
        "Akuse (Eastern Region)",
        "Hydro Power Plant",
        "160",
        "140",
        ""
      ],
      [
        "4",
        "Bui Hydroelectric Power Station",
        "Bui Gorge (Border Between Northern and Bono Region)",
        "Hydro Power Plant",
        "400",
        "360",
        ""
      ],
      [
        "5",
        "Tsatsadu Mini Hydro",
        "Hohoe District (Volta Region)",
        "Hydro Power Plant",
        "0.045",
        "0.045",
        ""
      ],
      [
        "6",
        "Thermal Power Stations",
        "",
        "",
        "",
        "",
        ""
      ],
      [
        "7",
        "Takoradi Power Company (TAPCO)",
        "Takoradi (Western Region)",
        "Thermal Power Plant",
        "330",
        "300",
        ""
      ],
      [
        "8",
        "Takoradi International Company (TICO)",
        "Takoradi (Western Region)",
        "Thermal Power Plant",
        "340",
        "320",
        ""
      ],
      [
        "9",
        "Tema Thermal 1 Power Plant (TT1PP)",
        "Tema (Greater Accra Region)",
        "Thermal Power Plant",
        "110",
        "100",
        ""
      ],
      [
        "10",
        "Tema Thermal 2 Power Plant (TT2PP)",
        "Tema (Greater Accra Region)",
        "Thermal Power Plant",
        "87",
        "70",
        ""
      ],
      [
        "",
        "Power Stations",
        "Location",
        "Type",
        "Installed Capacity (MW)",
        "Dependable Capacity (MW)",
        "Additional Description"
      ]
    ],
    "content": {
      "text": "ACEP's Electricity Monitor -\nGhana \n\t\t\t\t\t\t\t \n\t\t\t\t\t\t\tMake a Complaint \n\t\t\t\t\t\t\tPower Sector Insight & Complaints Made Easy \n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t\t\nACEP's Electricity Monitor -\nGhana \n\t\t\t\t\t\t\t \n\t\t\t\t\t\t\tMake a Complaint \n\t\t\t\t\t\t\tPower Sector Insight & Complaints Made Easy \n\t\t\t\t\t\t\t\t\t\t\t\t\t\n\t\t\t\t\t\n\t\t\t\t\n\t\t\t\t\n\t\t\t\t\tsetREVStartSize({c: 'rev_slider_1_1',rl:[1240,1024,778,480],el:[650,720,720,650],gw:[1170,991,767,480],gh:[650,720,720,650],type:'standard',justify:'',layout:'fullwidth',mh:\"0\"});if (window.RS_MODULES!==undefined && window.RS_MODULES.modules!==undefined && window.RS_MODULES.modules[\"revslider11\"]!==undefined) {window.RS_MODULES.modules[\"revslider11\"].once = false;window.revapi1 = undefined;if (window.RS_MODULES.checkMinimal!==undefined) window.RS_MODULES.checkMinimal()}\n\t\t\t\t\n\t\t\t\n\t\t\t\nAbout the Electricity Monitor - Ghana\n\t\n\t\t\n\t\t\tThe Electricity Monitor is a vital platform that empowers stakeholders to track and engage with Ghana’s power sector. It enables users to report challenges, s"
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/assets/dummy.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/assets/dummy.png",
        "srcset": null,
        "alt": ""
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1769027513"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1148656"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/bootstrap/wpdatatables-bootstrap.min.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/bootstrap/bootstrap-select/bootstrap-select.min.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/bootstrap/bootstrap-tagsinput/bootstrap-tagsinput.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/bootstrap/bootstrap-nouislider/bootstrap-nouislider.min.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/bootstrap/bootstrap-datetimepicker/wdt-bootstrap-datetimepicker.min.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/bootstrap/bootstrap-colorpicker/bootstrap-colorpicker.min.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/style.min.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/animate/animate.min.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/uikit/uikit.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/wdt.frontend.min.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/css/wdt-skins/aqua.css?ver=4.0.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-includes/css/dashicons.min.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/bootstrap/bootstrap-select/bootstrap-select.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/bootstrap/bootstrap.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/bootstrap/bootstrap-select/ajax-bootstrap-select.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/bootstrap/bootstrap-tagsinput/bootstrap-tagsinput.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/moment/moment.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/bootstrap/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/bootstrap/bootstrap-nouislider/bootstrap-nouislider.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/bootstrap/bootstrap-nouislider/wNumb.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/bootstrap/bootstrap-colorpicker/bootstrap-colorpicker.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/bootstrap/bootstrap-growl/bootstrap-growl.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/wpdatatables/admin/common.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/wpdatatables/wdt.frontend.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/underscore.min.js?ver=1.13.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/export-tools/jszip.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/export-tools/pdfmake.min.js?ver=4.0.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpdatatables/assets/js/export-tools/vfs_fonts.js?ver=4.0.1"
      }
    ]
  },
  {
    "id": "report-challenge",
    "name": "Report a Challenge",
    "url": "https://electricitymonitorgh.com/report-a-challenge/",
    "title": "Report a Challenge – ACEP's Electricity Monitor",
    "statistics": {},
    "powerPlants": [],
    "content": {
      "text": "Please enable JavaScript in your browser to complete this form.Name *FirstLastPhone *EmailLocation *Address Line 1CityState / Province / RegionIssue *Access to ElectricityMeter IssuePower Fluctuation / DumsorTariffs / Bill IssuesQuality of ServiceOtherIssue / Message *Submit"
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/images/submit-spin.svg",
        "srcset": null,
        "alt": "Loading"
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1769459490"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/css/wpforms-full.min.css?ver=1.7.7.1"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1154303"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/pro/css/fields/phone/intl-tel-input.min.css?ver=17.0.17"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms-geolocation/assets/css/wpforms-geolocation-google.min.css?ver=2.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/pro/lib/intl-tel-input/jquery.intl-tel-input.min.js?ver=17.0.17"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms-geolocation/assets/js/wpforms-geolocation-google-api.min.js?ver=2.3.1"
      },
      {
        "type": "js",
        "url": "https://maps.googleapis.com/maps/api/js?key=AIzaSyCzebkf8UL4m1bkPa9l944AoBAedATt0wI&libraries=places&callback=WPFormsGeolocationInitGooglePlacesAPI"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/lib/jquery.validate.min.js?ver=1.19.5"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/lib/jquery.inputmask.min.js?ver=5.0.7-beta.29"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/lib/mailcheck.min.js?ver=1.1.2"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/lib/punycode.min.js?ver=1.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/js/utils.min.js?ver=1.7.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wpforms/assets/js/wpforms.min.js?ver=1.7.7.1"
      }
    ]
  },
  {
    "id": "reported-challenges",
    "name": "Reported Challenges",
    "url": "https://electricitymonitorgh.com/reported-challenges/",
    "title": "Reported Challenges – ACEP's Electricity Monitor",
    "statistics": {},
    "powerPlants": [],
    "content": {
      "text": "@font-face {\n  font-family: 'Open Sans';\n  font-style: normal;\n  font-weight: 400;\n  font-stretch: normal;\n  font-display: swap;\n  src: url(/fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf) format('truetype');\n}\n@font-face {\n  font-family: 'Open Sans';\n  font-style: normal;\n  font-weight: 500;\n  font-stretch: normal;\n  font-display: swap;\n  src: url(/fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjr0B4gaVc.ttf) format('truetype');\n}\n@font-face {\n  font-family: 'Open Sans';\n  font-style: normal;\n  font-weight: 600;\n  font-stretch: normal;\n  font-display: swap;\n  src: url(/fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsgH1x4gaVc.ttf) format('truetype');\n}\n#ul76285.ultimate-layouts-container h3.ultimate-layouts-title, \n\t\t\t\t\t\t\t\t\t#ul76285.ultimate-layouts-container h3.ultimate-layouts-title a{font-family:\"Open Sans\" !important;font-size:16px !important;}.ul_quickview_p_ul"
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1768894679"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1146080"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core-min.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.clones.min.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.min.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.concat.min.js?ver=3.0.0"
      }
    ]
  },
  {
    "id": "transmission",
    "name": "Transmission",
    "url": "https://electricitymonitorgh.com/transmission/",
    "title": "Transmission – ACEP's Electricity Monitor",
    "statistics": {},
    "powerPlants": [],
    "content": {
      "text": "Transmission of electrical energy plays a pivotal role in delivering power from its point of generation, such as power plants, to local substations, where it is subsequently distributed to homes and businesses. In Ghana, this vital task is managed by the Ghana Grid Company Limited (GRIDCo). GRIDCo was established in accordance with the Energy Commission Act, 1997 (Act 541) and the Volta River Development (Amendment) Act, 2005 Act 692, to:\n\nUndertake economic dispatch and transmission of electricity from wholesale suppliers (generating companies) to bulk customers, which include the Electricity Company of Ghana (ECG), Northern Electricity Distribution Company (NEDCo) and the Mines.\nProvide fair and non-discriminatory transmission services to all power market participants.\nAcquire and manage assets, facilities and systems required to transmit electrical energy.\nProvide metering and billing services to bulk customers.\nCarry out transmission system planning and implement necessary investme"
    },
    "images": [
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": ""
      },
      {
        "src": "https://electricitymonitorgh.com/wp-content/uploads/2019/09/logomain.png",
        "srcset": null,
        "alt": "Site Logo"
      }
    ],
    "assets": [
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/fontawesome/css/font-awesome.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/animate.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/slick/slick.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/loaders.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/priority-navigation/priority-nav-core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/hover-css/hover.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/pagination/pagination.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/malihuscroll/jquery.mCustomScrollbar.min.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/stm-post-type/theme-options/nuxy/metaboxes/assets/vendors/font-awesome.min.css?ver=1769357796"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/bootstrap.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/v4-shims.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/bower/font-awesome/css/all.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/font-awesome.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/style.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/layout_liverpool/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/select2.min.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/header_builder.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/skin-custom.css?ver=1153286"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/uploads/stm_uploads/theme_options.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/css/layouts/global_styles/main.css?ver=6.2.7"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/css/megamenu.css?ver=6.9"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/css/js_composer.min.css?ver=6.8.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/header/main.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/vendor/sticky.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/css/font-awesome.min.css?ver=1.3.6"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/core.css?ver=3.0.0"
      },
      {
        "type": "css",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/css/rs6.css?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/ultimate-layouts-vc-2/assets/front-end/lazysizes.js?ver=3.0.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery.min.js?ver=3.7.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-includes/js/jquery/jquery-migrate.min.js?ver=3.4.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/inc/megamenu/assets/js/megamenu.js?ver=6.9"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rbtools.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/revslider/public/assets/js/rs6.min.js?ver=6.5.15"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/wp-google-map-gold/assets/js/vendor/webfont/webfont.js?ver=5.3.1"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/bootstrap.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/select2.min.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/themes/consulting/assets/js/custom.js?ver=6.2.7"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/page-links-to/dist/new-tab.js?ver=3.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/app.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/pearl-header-builder/assets/frontend/assets/js/sticky.js?ver=1.3.6"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/js/dist/js_composer_front.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_waypoints/vc-waypoints.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/chart-js-dist/chart.min.js?ver=6.8.0"
      },
      {
        "type": "js",
        "url": "https://electricitymonitorgh.com/wp-content/plugins/js_composer/assets/lib/vc_line_chart/vc_line_chart.min.js?ver=6.8.0"
      }
    ]
  }
];
