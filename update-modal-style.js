const { Project, SyntaxKind } = require('ts-morph');

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

let count = 0;

for (const sourceFile of project.getSourceFiles()) {
  if (sourceFile.getFilePath().includes('node_modules') || sourceFile.getFilePath().includes('.next')) continue;
  
  let modified = false;
  
  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  
  for (const callExpr of callExpressions) {
    if (callExpr.getExpression().getText() === 'confirm') {
      const args = callExpr.getArguments();
      if (args.length === 1 && args[0].getKind() === SyntaxKind.ObjectLiteralExpression) {
        const obj = args[0];
        
        const typeProp = obj.getProperty('type');
        if (typeProp && typeProp.getKind() === SyntaxKind.PropertyAssignment) {
           const init = typeProp.getInitializer();
           if (init && init.getText() === "'warning'") {
              init.replaceWithText("'danger'");
              modified = true;
           }
        }
        
        // Let's also check if 't' is imported so we don't break TS if we use t('...')
        // Actually, let's just change the static text to 'Are you sure?' instead of relying on t() since we can't guarantee t is available
        const titleProp = obj.getProperty('title');
        if (titleProp && titleProp.getKind() === SyntaxKind.PropertyAssignment) {
           const init = titleProp.getInitializer();
           if (init && init.getText() === "'Confirmation'") {
              init.replaceWithText("'Are you sure?'");
              modified = true;
           }
        }
      }
    }
  }

  if (modified) {
    sourceFile.saveSync();
    count++;
  }
}

console.log(`Updated ${count} files to use danger style.`);
