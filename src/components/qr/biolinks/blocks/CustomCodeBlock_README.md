# Custom Code Block

The Custom Code Block is an advanced component for the Karsaaz QR Biolinks system that allows users to embed custom HTML, CSS, and JavaScript code with comprehensive security protections and sandboxed execution.

## Features

### 🔒 Security-First Design
- **Sandboxed Execution**: All code runs in isolated iframes with sandbox attributes
- **XSS Protection**: Automatic detection and warnings for cross-site scripting attempts
- **Code Validation**: Real-time security scanning for dangerous patterns
- **JavaScript Control**: JS execution disabled by default, must be explicitly enabled
- **HTML Sanitization**: Automatic removal of dangerous tags and attributes

### 🛠️ Development Features
- **Multi-Language Support**: HTML, CSS, JavaScript with syntax highlighting
- **Combined Mode**: Write HTML with embedded `<style>` and `<script>` tags
- **Live Preview**: Real-time preview with sandboxed rendering
- **Code Editor**: Built-in code editor with line numbers and syntax highlighting
- **Auto-run Preview**: Optional automatic preview updates while editing

### 🎨 User Experience
- **Edit and Public Modes**: Separate interfaces for editing and viewing
- **Security Warnings**: Clear warnings for potentially dangerous code
- **Settings Panel**: Toggle sandbox mode, security warnings, and auto-run
- **Tabbed Interface**: Easy switching between code editing and preview

## Usage

### Adding a Custom Code Block

1. Open the Biolink Block Editor
2. Click "Add Block" and select "Custom Code" from the Advanced category
3. Choose your code type:
   - **Combined**: Write HTML with embedded `<style>` and `<script>` tags
   - **HTML Only**: Pure HTML code
   - **CSS Only**: Stylesheet code
   - **JavaScript Only**: JavaScript logic

4. Write your code in the editor
5. Preview your code in the Preview tab
6. Adjust settings as needed
7. Save the block

### Code Examples

#### Example 1: HTML + CSS Card
```html
<!-- HTML -->
<div class="demo-card">
  <h2>Welcome!</h2>
  <p>This is a styled card component.</p>
  <button>Click Me</button>
</div>

<!-- CSS -->
<style>
.demo-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}
</style>
```

#### Example 2: Animated Component
```html
<!-- HTML -->
<div class="box" id="animated-box"></div>
<button id="animate-btn">Animate</button>

<!-- CSS -->
<style>
.box {
  width: 80px;
  height: 80px;
  background: #ff6b6b;
  margin: 2rem auto;
  border-radius: 8px;
  transition: all 0.3s ease;
}
</style>

<!-- JavaScript -->
<script>
document.getElementById('animate-btn').addEventListener('click', () => {
  const box = document.getElementById('animated-box');
  box.style.transform = 'rotate(360deg) scale(1.5)';
});
</script>
```

#### Example 3: Interactive Counter
```javascript
// Enable JavaScript in settings first!
let count = 0;

function updateDisplay() {
  document.querySelector('.counter').textContent = count;
}

document.querySelector('.increase').addEventListener('click', () => {
  count++;
  updateDisplay();
});

updateDisplay();
```

## Security Features

### Sandboxed Execution
- All code runs in an isolated iframe
- Restricted access to parent page and cookies
- Limited access to browser APIs
- Cannot access localStorage or sessionStorage

### XSS Protection
The system detects and warns about:
- `<script>` tags in HTML
- Inline event handlers (`onclick`, `onload`, etc.)
- `javascript:` URLs
- `eval()`, `Function()`, and similar dangerous functions
- Cookie access attempts
- Parent window/frame access

### Code Validation
Real-time scanning for forbidden patterns:
- XSS attack vectors
- Code injection attempts
- Unauthorized API access
- Malicious code patterns

### Security Warnings
When potentially dangerous code is detected, the system shows:
- Clear warning messages
- Specific information about the detected issue
- Recommendations for safe alternatives

## Settings

### Sandbox Mode
- **Enabled by default**
- Runs code in isolated iframe
- Prevents access to parent page
- Recommended for all user-generated content

### Security Warnings
- **Enabled by default**
- Shows warnings for potentially dangerous code
- Helps users understand security implications
- Can be disabled for trusted users

### Auto-Run Preview
- **Disabled by default**
- Automatically updates preview while editing
- May impact performance with complex code
- Recommended to keep disabled for large codebases

### Enable JavaScript
- **Disabled by default**
- Must be explicitly enabled for each block
- Shows warning when JavaScript is present but disabled
- Prevents accidental script execution

## Best Practices

### For Users
1. **Start Simple**: Begin with HTML and CSS before adding JavaScript
2. **Test Thoroughly**: Use the preview mode to test all functionality
3. **Enable Security Warnings**: Keep security warnings enabled
4. **Use Sandboxing**: Always run code in sandboxed mode
5. **Validate Input**: Sanitize any user input in your custom code

### For Developers
1. **Review Code**: Review custom code before allowing on public pages
2. **Limit Access**: Only give trusted users access to custom code blocks
3. **Monitor Usage**: Track custom code usage and performance
4. **Update Regularly**: Keep security patterns updated
5. **Educate Users**: Provide guidelines for safe code writing

## API Reference

### Block Content Interface
```typescript
interface CustomCodeContent {
  html: string;
  css: string;
  javascript: string;
  codeType: 'html' | 'css' | 'javascript' | 'combined';
  showPreview: boolean;
  autoRun: boolean;
  enableHtml: boolean;
  enableCss: boolean;
  enableJs: boolean;
  securityWarnings: boolean;
  sandboxMode: boolean;
}
```

### Security Validator
```typescript
class CodeSecurityValidator {
  static validate(html, css, javascript): {
    valid: boolean;
    warnings: string[];
  }
  
  static sanitizeHtml(html): string;
  
  static extractCodeBlocks(code): {
    html: string;
    css: string;
    js: string;
  }
}
```

## Troubleshooting

### Common Issues

#### Code Not Running
- Check if JavaScript is enabled in settings
- Verify code syntax is correct
- Ensure sandbox mode is configured properly
- Check browser console for errors

#### Security Warnings
- Review the specific warning message
- Consider alternative approaches
- Test code in isolated environment
- Consult security guidelines

#### Preview Not Updating
- Check if auto-run is enabled
- Verify code changes are saved
- Clear browser cache
- Check for JavaScript errors in console

## Performance Considerations

- Large code blocks may impact page load times
- Complex JavaScript can affect page performance
- Multiple custom code blocks compound performance impact
- Use lazy loading for non-critical custom code
- Optimize images and assets within custom code

## Examples Gallery

See [CustomCodeBlock.demo.tsx](./CustomCodeBlock.demo.tsx) for complete working examples including:
- Animated components
- Interactive widgets
- Styled cards and layouts
- Form components
- Data visualizations

## Updates and Maintenance

- Security patterns updated regularly
- New features added based on user feedback
- Performance improvements ongoing
- Browser compatibility maintained
