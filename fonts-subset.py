
# pip install fonttools brotli

from fontTools import subset

# ========= CONFIG =========

SOLID_INPUT = "/home/fa-solid-900.ttf"
BRANDS_INPUT = "/home/fa-brands-400.ttf"

SOLID_OUTPUT = "fa-solid-subset.woff2"
BRANDS_OUTPUT = "fa-brands-subset.woff2"

# ========= REQUIRED SOLID ICONS =========

solid_unicode = [

    "f095", # phone
    "f0c0", # users
    "f0f2", # suitcase
    "f2dc", # snowflake
    "f00d", # xmark
    "f3fd", # tachometer-alt
    "f52f", # gas-pump
    "f058", # check-circle
    "f0e7", # bolt
    "f192", # dot-circle-o
    "f0e0", # envelope
    "f015", # home
    "f007", # user

    # NEW
    "f3c5", # location-dot
    "f073", # calendar-days
    "f017", # clock
]

# ========= REQUIRED BRANDS ICONS =========

brands_unicode = [
    "f232", # whatsapp
    "f09a", # facebook
    "f08c", # linkedin
    "f16d", # instagram
    "f16a", # youtube
]

# ========= SUBSET FUNCTION =========

def subset_font(input_font, output_font, unicodes):

    options = subset.Options()

    options.flavor = "woff2"
    options.with_zopfli = False
    options.desubroutinize = True

    font = subset.load_font(input_font, options)

    subsetter = subset.Subsetter()

    subsetter.populate(
        unicodes=[int(u, 16) for u in unicodes]
    )

    subsetter.subset(font)

    subset.save_font(font, output_font, options)

    print(f"Generated: {output_font}")

# ========= RUN =========

subset_font(
    SOLID_INPUT,
    SOLID_OUTPUT,
    solid_unicode
)

subset_font(
    BRANDS_INPUT,
    BRANDS_OUTPUT,
    brands_unicode
)
