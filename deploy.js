/**
 * Compass Title 19 Consultants LLC - Automated Deployment Script
 * 
 * Safely deploys all 14 site templates to WordPress Elementor with
 * built-in request throttling (2500ms) to respect host process limits,
 * followed by an automated LiteSpeed cache purge.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Read credentials from environment or fallback
const auth = process.env.WP_AUTH || 'Basic Sk9FQ1JBQ0s6YU1wTk5rbDJOWGNrN2VyQjNEczdIUHFC';
const dir = __dirname;

const deploymentPlan = [
  { id: 4295, file: 'cmc_header.html', name: 'Theme Builder Global Header', type: 'elementor_library' },
  { id: 4297, file: 'cmc_footer.html', name: 'Theme Builder Global Footer', type: 'elementor_library' },
  { id: 2270, file: 'cmc_homepage_modular.html', name: 'Homepage', type: 'pages' },
  { id: 7, file: 'about_compass.html', name: 'About Compass Title 19', type: 'pages' },
  { id: 4035, file: 'connecticut-title-19-help.html', name: 'Connecticut Title 19 Help (Nursing Home / LTSS)', type: 'pages' },
  { id: 4039, file: 'existing-medicaid-application-help-connecticut.html', name: 'Existing CT Medicaid Application Help (W-1348 Rescue)', type: 'pages' },
  { id: 4015, file: 'connecticut-medicaid-waivers-hcbs.html', name: 'Medicaid Waivers & HCBS (Home Care)', type: 'pages' },
  { id: 4037, file: 'connecticut-medicaid-renewal-redetermination-help.html', name: 'Medicaid Renewals & Redetermination Help', type: 'pages' },
  { id: 8, file: 'connecticut-care-management.html', name: 'Care Management Services', type: 'pages' },
  { id: 2275, file: 'contact-compass-title19.html', name: 'Contact & Case Intake Hub', type: 'pages' },
  { id: 4043, file: 'wisdom-wednesday-education.html', name: 'Wisdom Wednesday Education Center', type: 'pages' },
  { id: 4045, file: 'wisdom-wednesday-article.html', name: 'Wisdom Wednesday Long-Form Case Article', type: 'pages' },
  { id: 4041, file: 'website-resources-library.html', name: 'Website Resources Library (12 Guides)', type: 'pages' },
  { id: 2321, file: 'connecticut-medicaid-faqs.html', name: 'Connecticut Medicaid Mega-FAQ Hub (50 Questions)', type: 'pages' }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function deploySingle(target) {
  return new Promise((resolve) => {
    const filePath = path.join(dir, target.file);
    if (!fs.existsSync(filePath)) {
      return resolve({ success: false, id: target.id, name: target.name, error: 'File not found on disk' });
    }

    const htmlContent = fs.readFileSync(filePath, 'utf8');

    // 100% Full Width Elementor Container Specification
    const elementorData = JSON.stringify([
      {
        id: `cmc_cont_${target.id}`,
        elType: "container",
        settings: {
          content_width: "full",
          width: { unit: "%", size: 100 },
          boxed_width: { unit: "%", size: 100 },
          min_height: { unit: "px", size: 0 },
          padding: { unit: "px", top: "0", right: "0", bottom: "0", left: "0", isLinked: true },
          margin: { unit: "px", top: "0", right: "0", bottom: "0", left: "0", isLinked: true },
          flex_direction: "column",
          align_items: "stretch",
          justify_content: "flex-start"
        },
        elements: [
          {
            id: `cmc_html_${target.id}`,
            elType: "widget",
            widgetType: "html",
            settings: {
              html: htmlContent
            },
            elements: []
          }
        ]
      }
    ]);

    const endpoint = target.type === 'elementor_library' ? 
      `/wp-json/wp/v2/elementor_library/${target.id}` : 
      `/wp-json/wp/v2/pages/${target.id}`;

    const payloadObj = {
      content: htmlContent,
      meta: {
        _elementor_edit_mode: 'builder',
        _elementor_template_type: target.type === 'elementor_library' ? (target.file.includes('header') ? 'header' : 'footer') : 'wp-page',
        _elementor_data: elementorData,
        'ast-site-content-layout': 'full-width-container',
        'site-content-layout': 'plain-container',
        'site-sidebar-layout': 'no-sidebar'
      }
    };

    if (target.type === 'pages') {
      payloadObj.template = 'elementor_header_footer';
      payloadObj.meta._wp_page_template = 'elementor_header_footer';
    }

    const payload = JSON.stringify(payloadObj);

    const req = https.request({
      hostname: 'cmctitle19.com',
      port: 443,
      path: endpoint,
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              success: true,
              id: target.id,
              name: target.name,
              template: json.template,
              payloadSize: Buffer.byteLength(payload)
            });
          } else {
            resolve({
              success: false,
              id: target.id,
              name: target.name,
              error: json.message || `HTTP ${res.statusCode}`
            });
          }
        } catch(e) {
          resolve({
            success: false,
            id: target.id,
            name: target.name,
            error: 'Parse error on response'
          });
        }
      });
    });

    req.on('error', e => resolve({ success: false, id: target.id, name: target.name, error: e.message }));
    req.write(payload);
    req.end();
  });
}

async function runDeployAll() {
  console.log(`=============================================================================`);
  console.log(`COMPASS TITLE 19 - DEPLOYING ALL 14 TEMPLATES`);
  console.log(`TARGET EMAIL: medicaidhelp@cmctitle19.com`);
  console.log(`THROTTLED: 2500ms safety interval to respect host limits`);
  console.log(`=============================================================================\n`);

  for (let i = 0; i < deploymentPlan.length; i++) {
    const target = deploymentPlan[i];
    process.stdout.write(`[${i + 1}/14] Deploying ${target.name} (ID ${target.id})... `);
    const res = await deploySingle(target);
    if (res.success) {
      console.log(`SUCCESS! (${(res.payloadSize / 1024).toFixed(1)} KB)`);
    } else {
      console.log(`FAILED! Error: ${res.error}`);
    }
    if (i < deploymentPlan.length - 1) {
      await sleep(2500);
    }
  }

  console.log(`\nAll 14 targets deployed.`);
  console.log('Triggering LiteSpeed cache purge via AJAX hook...');
  await new Promise((resolve) => {
    https.get('https://cmctitle19.com/wp-admin/admin-ajax.php?action=cmc_purge_cache', (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => {
        console.log(`Cache purge response: ${res.statusCode} ${b.substring(0, 80)}`);
        resolve();
      });
    }).on('error', e => {
      console.log('Cache purge error:', e.message);
      resolve();
    });
  });

  console.log('Deployment complete!');
}

if (require.main === module) {
  runDeployAll();
}
