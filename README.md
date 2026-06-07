# Projetgithub
https://github.com/DJERANEDJIMASNGAR/Projetgithub.git

## Cache-bust CSS
Si les modifications CSS ne s'affichent pas à cause du cache, utilisez le script PowerShell suivant pour incrémenter automatiquement le paramètre `?v=` dans `index.html` avant de commit/push :

```
# depuis la racine du projet (PowerShell)
.\scripts\bump_css_version.ps1
git add index.html
git commit -m "Bump CSS version"
git push
```

Le script ajoute ou incrémente `?v=N` dans la référence à `style.css` dans `index.html`.

Si vous préférez une solution automatique, vous pouvez configurer `core.hooksPath` et ajouter un hook `pre-commit` qui exécute ce script.
Sprint Review réalisée