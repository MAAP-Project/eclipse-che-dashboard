serve-local:	## Serve the site using the (DIT) environment
	yarn serve --server https://ade.dit.maap-project.org

# ----------------------------------------------------------------------------
# Self-Documented Makefile
# ref: http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
# ----------------------------------------------------------------------------
help:						## (DEFAULT) This help information
	@echo ====================================================================
	@grep -E '^## .*$$'  \
		$(MAKEFILE_LIST)  \
		| awk 'BEGIN { FS="## " }; {printf "\033[33m%-20s\033[0m \n", $$2}'
	@echo
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$'  \
		$(MAKEFILE_LIST)  \
		| awk 'BEGIN { FS=":.*?## " }; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'  \
#		 | sort
.PHONY: help
.DEFAULT_GOAL := help