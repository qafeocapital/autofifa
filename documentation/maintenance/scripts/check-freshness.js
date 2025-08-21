#!/usr/bin/env node

/**
 * Documentation Freshness Checker
 * Identifies stale content and generates freshness reports
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const CONFIG = {
    DOCS_DIR: './documentation',
    MAX_DAYS_FRESH: 30,
    MAX_DAYS_STALE: 90,
    IGNORE_PATTERNS: [
        'node_modules/**',
        '.git/**',
        '**/CHANGELOG.md' // Changelog is updated differently
    ]
};

// Color codes for console output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
};

/**
 * Extract last updated date from markdown front matter or content
 */
function extractLastUpdated(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Try to find "Last Updated" in various formats
        const patterns = [
            /\*\*Last Updated\*\*:\s*(\d{4}-\d{2}-\d{2})/,
            /Last Updated:\s*(\d{4}-\d{2}-\d{2})/,
            /last[_\s]updated:\s*(\d{4}-\d{2}-\d{2})/i,
            /updated:\s*(\d{4}-\d{2}-\d{2})/i
        ];
        
        for (const pattern of patterns) {
            const match = content.match(pattern);
            if (match) {
                return new Date(match[1]);
            }
        }
        
        // Fallback to file modification time
        const stats = fs.statSync(filePath);
        return stats.mtime;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Calculate days since last update
 */
function daysSinceUpdate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get freshness status based on days since update
 */
function getFreshnessStatus(days) {
    if (days <= CONFIG.MAX_DAYS_FRESH) {
        return { status: 'fresh', color: colors.green, icon: '✅' };
    } else if (days <= CONFIG.MAX_DAYS_STALE) {
        return { status: 'aging', color: colors.yellow, icon: '⚠️' };
    } else {
        return { status: 'stale', color: colors.red, icon: '❌' };
    }
}

/**
 * Extract document metadata
 */
function extractMetadata(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        const metadata = {};
        
        // Extract title (first h1)
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch) {
            metadata.title = titleMatch[1];
        }
        
        // Extract owner
        const ownerMatch = content.match(/\*\*Owner\*\*:\s*(.+)/);
        if (ownerMatch) {
            metadata.owner = ownerMatch[1];
        }
        
        // Extract version
        const versionMatch = content.match(/\*\*Version\*\*:\s*(.+)/);
        if (versionMatch) {
            metadata.version = versionMatch[1];
        }
        
        // Estimate word count
        const wordCount = content.split(/\s+/).length;
        metadata.wordCount = wordCount;
        
        return metadata;
    } catch (error) {
        return {};
    }
}

/**
 * Generate HTML report
 */
function generateHTMLReport(results) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Documentation Freshness Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; margin: 40px; }
        .header { background: #f6f8fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .summary { display: flex; gap: 20px; margin: 20px 0; }
        .stat-box { background: white; border: 1px solid #e1e5e9; padding: 15px; border-radius: 6px; text-align: center; flex: 1; }
        .stat-number { font-size: 24px; font-weight: bold; }
        .fresh { color: #28a745; }
        .aging { color: #ffc107; }
        .stale { color: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e1e5e9; }
        th { background: #f6f8fa; font-weight: 600; }
        .status-fresh { background: #d4edda; color: #155724; }
        .status-aging { background: #fff3cd; color: #856404; }
        .status-stale { background: #f8d7da; color: #721c24; }
        .progress-bar { width: 100%; height: 8px; background: #e1e5e9; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 0.3s ease; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Documentation Freshness Report</h1>
        <p>Generated on ${new Date().toISOString().split('T')[0]} | Total Documents: ${results.length}</p>
    </div>
    
    <div class="summary">
        <div class="stat-box">
            <div class="stat-number fresh">${results.filter(r => r.freshness.status === 'fresh').length}</div>
            <div>Fresh (≤30 days)</div>
        </div>
        <div class="stat-box">
            <div class="stat-number aging">${results.filter(r => r.freshness.status === 'aging').length}</div>
            <div>Aging (31-90 days)</div>
        </div>
        <div class="stat-box">
            <div class="stat-number stale">${results.filter(r => r.freshness.status === 'stale').length}</div>
            <div>Stale (>90 days)</div>
        </div>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Document</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Days Ago</th>
                <th>Owner</th>
                <th>Words</th>
            </tr>
        </thead>
        <tbody>
            ${results.map(result => `
                <tr>
                    <td><strong>${result.metadata.title || path.basename(result.file)}</strong></td>
                    <td><span class="status-${result.freshness.status}">${result.freshness.icon} ${result.freshness.status.toUpperCase()}</span></td>
                    <td>${result.lastUpdated.toISOString().split('T')[0]}</td>
                    <td>${result.daysSince}</td>
                    <td>${result.metadata.owner || 'Not specified'}</td>
                    <td>${result.metadata.wordCount || 0}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
    
    fs.writeFileSync('./documentation-freshness-report.html', html);
    console.log(`${colors.blue}📊 HTML report generated: documentation-freshness-report.html${colors.reset}`);
}

/**
 * Main execution
 */
function main() {
    console.log(`${colors.cyan}🔍 Checking documentation freshness...${colors.reset}\n`);
    
    // Find all markdown files
    const pattern = path.join(CONFIG.DOCS_DIR, '**/*.md');
    const files = glob.sync(pattern, { ignore: CONFIG.IGNORE_PATTERNS });
    
    if (files.length === 0) {
        console.log(`${colors.red}❌ No markdown files found in ${CONFIG.DOCS_DIR}${colors.reset}`);
        return;
    }
    
    const results = [];
    let freshCount = 0;
    let agingCount = 0;
    let staleCount = 0;
    
    // Process each file
    files.forEach(file => {
        const lastUpdated = extractLastUpdated(file);
        if (!lastUpdated) return;
        
        const daysSince = daysSinceUpdate(lastUpdated);
        const freshness = getFreshnessStatus(daysSince);
        const metadata = extractMetadata(file);
        
        const result = {
            file,
            lastUpdated,
            daysSince,
            freshness,
            metadata
        };
        
        results.push(result);
        
        // Count by status
        if (freshness.status === 'fresh') freshCount++;
        else if (freshness.status === 'aging') agingCount++;
        else staleCount++;
        
        // Console output
        const relativePath = path.relative(process.cwd(), file);
        console.log(`${freshness.color}${freshness.icon} ${relativePath}${colors.reset}`);
        console.log(`   Last updated: ${lastUpdated.toISOString().split('T')[0]} (${daysSince} days ago)`);
        if (metadata.owner) console.log(`   Owner: ${metadata.owner}`);
        console.log('');
    });
    
    // Summary
    console.log('\n📋 FRESHNESS SUMMARY');
    console.log('====================');
    console.log(`${colors.green}✅ Fresh (≤30 days): ${freshCount}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Aging (31-90 days): ${agingCount}${colors.reset}`);
    console.log(`${colors.red}❌ Stale (>90 days): ${staleCount}${colors.reset}`);
    console.log(`📊 Total documents: ${results.length}\n`);
    
    // Recommendations
    if (staleCount > 0) {
        console.log(`${colors.red}🚨 ATTENTION NEEDED:${colors.reset}`);
        console.log(`${staleCount} document(s) are stale and should be reviewed/updated.\n`);
    }
    
    if (agingCount > 0) {
        console.log(`${colors.yellow}⚠️  REVIEW RECOMMENDED:${colors.reset}`);
        console.log(`${agingCount} document(s) are aging and may need updates.\n`);
    }
    
    // Generate reports
    generateHTMLReport(results);
    
    // Exit code based on freshness
    if (staleCount > 0) {
        process.exit(1); // Fail if stale content exists
    } else if (agingCount > results.length / 2) {
        process.exit(1); // Fail if more than half are aging
    } else {
        process.exit(0); // Success
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { extractLastUpdated, daysSinceUpdate, getFreshnessStatus };