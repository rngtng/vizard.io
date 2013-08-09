build: .make.bundle
	rm -rf ./cache # for Airbrake
	ln -sf /tmp ./cache

JRUBY_VERSION=1.7.3
JRUBY_TARBALL=http://files.int.s-cloud.net/jruby/jruby-bin-$(JRUBY_VERSION).tar.gz
JRUBY_DIR=vendor/jruby-$(JRUBY_VERSION)
JRUBY=$(JRUBY_DIR)/bin/jruby

GEM=$(JRUBY) -S gem

PATH := $(JRUBY_DIR)/bin:$(PATH)

$(JRUBY):
	mkdir -p $(JRUBY_DIR)
	curl -o $(JRUBY_DIR)/jruby-bin.tar.gz $(JRUBY_TARBALL)
	cd $(JRUBY_DIR) && tar xzf jruby-bin.tar.gz --strip-components=1
	touch $@

BUNDLE_DIR=vendor/bundle
BUNDLER_VERSION=~> 1.2.0
BUNDLER_BIN=$(BUNDLE_DIR)/bin/bundle
BUNDLER=$(JRUBY) -S bundle

GEM_HOME := $(BUNDLE_DIR)

$(BUNDLER_BIN): $(JRUBY)
	$(GEM) install bundler -v "$(BUNDLER_VERSION)" --no-rdoc --no-ri

.make.bundle: $(BUNDLER_BIN) Gemfile.lock
	$(BUNDLER) install --deployment --path $(BUNDLE_DIR)
	touch $@

clean:
	rm -rf .bundle

mrproper: clean
	rm -rf $(BUNDLE_DIR) $(JRUBY_DIR)

cleanall:
	git clean -x -d -f
