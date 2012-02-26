:: ÉèÖÃÄ¿Â¼Ãû
set jsPath=artDialog5.0

java -jar compiler.jar --js "../%jsPath%/source/artDialog.js" --js_output_file "../%jsPath%/artDialog.min.js"

java -jar compiler.jar --js "../%jsPath%/source/jquery.artDialog.js" --js_output_file "../%jsPath%/jquery.artDialog.min.js"

java -jar compiler.jar --js "../%jsPath%/source/artDialog.plugins.js" --js_output_file "../%jsPath%/artDialog.plugins.min.js"