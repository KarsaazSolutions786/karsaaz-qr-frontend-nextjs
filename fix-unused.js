const { Project, SyntaxKind } = require('ts-morph');
const project = new Project({ tsConfigFilePath: "tsconfig.json" });
let count = 0;
for (const sourceFile of project.getSourceFiles()) {
  let fileModified = false;
  const varDecls = sourceFile.getDescendantsOfKind(SyntaxKind.VariableDeclaration);
  for (const decl of varDecls) {
    if (decl.getText().includes('{ confirm }')) {
      const parent = decl.getParent();
      const statement = parent.getParent();
      // If it's `const { confirm } = useConfirmation();`
      if (statement.getKind() === SyntaxKind.VariableStatement) {
        // Is `confirm` used anywhere else in the block?
        const block = statement.getParent();
        const blockText = block.getText();
        const matches = blockText.match(/\bconfirm\b/g);
        // If it's only found once (the declaration itself), it's unused in this block
        if (matches && matches.length === 1) {
          statement.remove();
          fileModified = true;
        }
      }
    }
  }
  if (fileModified) {
    sourceFile.saveSync();
    count++;
  }
}
console.log('Fixed ' + count + ' files');
