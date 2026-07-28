const { Project, SyntaxKind } = require('ts-morph');

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

let modifiedFilesCount = 0;

for (const sourceFile of project.getSourceFiles()) {
  if (sourceFile.getFilePath().includes('node_modules') || sourceFile.getFilePath().includes('.next')) continue;
  if (sourceFile.getFilePath().includes('confirmation-modal.tsx')) continue;

  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  const confirmCalls = [];

  for (const callExpr of callExpressions) {
    try {
      const expr = callExpr.getExpression();
      const text = expr.getText();
      
      if (text === 'window.confirm') {
          confirmCalls.push(callExpr);
      } else if (text === 'confirm') {
          const hasUseConfirmation = sourceFile.getText().includes('useConfirmation');
          if (!hasUseConfirmation) {
              confirmCalls.push(callExpr);
          }
      }
    } catch {
      // ignore
    }
  }

  if (confirmCalls.length === 0) continue;

  let needsImport = false;
  let fileModified = false;

  for (let i = confirmCalls.length - 1; i >= 0; i--) {
    const callExpr = confirmCalls[i];
    try {
      const args = callExpr.getArguments();
      if (args.length === 1) {
        let messageText = args[0].getText();
        let currentParent = callExpr.getParent();
        
        callExpr.replaceWithText(`await confirm({ title: 'Confirmation', message: ${messageText}, type: 'warning' })`);
        needsImport = true;
        fileModified = true;

        while (currentParent) {
            if (currentParent.getKind() === SyntaxKind.FunctionDeclaration || 
                currentParent.getKind() === SyntaxKind.ArrowFunction ||
                currentParent.getKind() === SyntaxKind.FunctionExpression ||
                currentParent.getKind() === SyntaxKind.MethodDeclaration) {
                
                if (!currentParent.isAsync()) {
                    currentParent.setIsAsync(true);
                }
                break;
            }
            currentParent = currentParent.getParent();
        }
      }
    } catch (e) {
      console.log(`Error processing confirm in ${sourceFile.getFilePath()}:`, e.message);
    }
  }

  if (fileModified) {
    const importDecl = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === '@/components/ui/confirmation-modal');
    if (!importDecl) {
      sourceFile.addImportDeclaration({
        namedImports: ['useConfirmation'],
        moduleSpecifier: '@/components/ui/confirmation-modal',
      });
    } else {
      const hasHook = importDecl.getNamedImports().some(ni => ni.getName() === 'useConfirmation');
      if (!hasHook) {
        importDecl.addNamedImport('useConfirmation');
      }
    }

    let insertedHook = false;
    
    const functions = [
      ...sourceFile.getFunctions(),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration).filter(v => v.getInitializer()?.getKind() === SyntaxKind.ArrowFunction).map(v => v.getInitializer()),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.FunctionExpression)
    ];

    for (const func of functions) {
      if (!func || !func.getBody) continue;
      const body = func.getBody();
      if (!body) continue;
      
      const hasJsx = body.getDescendantsOfKind(SyntaxKind.JsxElement).length > 0 || 
                     body.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement).length > 0 ||
                     body.getDescendantsOfKind(SyntaxKind.JsxFragment).length > 0;
                     
      if (hasJsx && body.getKind() === SyntaxKind.Block) {
         body.insertStatements(0, 'const { confirm } = useConfirmation();');
         insertedHook = true;
      }
    }
    
    if (!insertedHook) {
       console.log(`Warning: Could not automatically inject hook into a React component for ${sourceFile.getFilePath()}`);
    }

    sourceFile.saveSync();
    modifiedFilesCount++;
    console.log(`Updated ${sourceFile.getFilePath()}`);
  }
}

console.log(`\nMigration complete. Modified ${modifiedFilesCount} files.`);
